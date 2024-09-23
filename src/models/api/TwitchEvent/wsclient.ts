// Copyright (c) 2022-2023 Mitchell Adair
//
// This software is released under the MIT License.

import { EventManager } from "./events";
import { logger } from "./logger";
import { TESUtils } from "./utils";

// https://opensource.org/licenses/MIT
const WebSocket = require("ws");

const WS_URL = "wss://eventsub.wss.twitch.tv/ws";

export class WebSocketClient {
    _connections: Record<
        string,
        {
            close(): unknown;
            keepaliveTimeout: any;
            subscriptions: Record<
                string,
                { type: string; condition: Record<string, any> }
            >;
        }
    >;
    _wsURL: string;

    constructor(wsURL: string) {
        this._connections = {};

        this._wsURL = wsURL || WS_URL;
    }

    close() {
        logger.debug("Closing all WebSocket connections");
        Object.keys(this._connections).forEach((connectionID) => {
            const ws = this._connections[connectionID];
            if (ws.keepaliveTimeout) {
                clearTimeout(ws.keepaliveTimeout);
            }
            ws.close();
            delete this._connections[connectionID];
        });
    }

    /**
     * Get the ID of a free WebSocket connection
     *
     * @returns a Promise resolving to the ID of a free WebSocket connection
     */
    async getFreeConnection(eventManager: EventManager): Promise<string> {
        logger.debug("Getting free WebSocket connection");
        const connectionID = Object.keys(this._connections).find((key) => {
            return (
                Object.keys(this._connections[key].subscriptions).length < 300
            );
        });
        if (connectionID) {
            logger.debug(`Found free WebSocket connection "${connectionID}"`);
            return connectionID;
        } else {
            if (Object.keys(this._connections).length < 3) {
                logger.debug(
                    "No free WebSocket connections, creating a new one..."
                );
                return new Promise((resolve) =>
                    this._addConnection(resolve, undefined, eventManager)
                );
            } else {
                logger.debug(
                    "No free WebSocket connections, maximum number of connections reached"
                );
                throw new Error(
                    "Maximum number of WebSocket connections reached"
                );
            }
        }
    }

    /**
     * Remove a subscription from our connections
     *
     * @param {string} id the id of the subscription to remove
     */
    removeSubscription(id: string | number) {
        // naively delete from ALL connections -- connections without that subscription will be unaffected
        Object.values(this._connections).forEach(
            (connection) => delete connection.subscriptions[id]
        );
    }

    /**
     * Add a subscription to a connection
     *
     * @param {string} connectionID the connection id
     * @param {Subscription} subscription the subscription data
     */
    addSubscription(
        connectionID: string | number,
        { id, type, condition }: any
    ) {
        this._connections[connectionID].subscriptions[id] = { type, condition };
    }

    /**
     * Get the subscription ID for a type and condition
     *
     * @param {string} type the subscription type
     * @param {Condition} condition the condition
     */
    findSubscriptionID(type: string, condition: any) {
        for (const session in this._connections) {
            const connection = this._connections[session];
            const id = Object.keys(connection.subscriptions).find((key) => {
                const subscription = connection.subscriptions[key];
                return (
                    subscription.type === type &&
                    TESUtils.objectShallowEquals(
                        subscription.condition,
                        condition
                    )
                );
            });
            if (id) {
                return id;
            }
        }
    }

    _addConnection(
        onWelcome: (id: string) => void,
        url = this._wsURL,
        eventManager: EventManager
    ) {
        const ws = new WebSocket(url);
        ws.onmessage = (event: { data: string }) => {
            const {
                metadata: { message_type },
                payload,
            } = JSON.parse(event.data);
            if (message_type === "session_welcome") {
                const {
                    session: { id, keepalive_timeout_seconds },
                } = payload;
                logger.debug(`Received welcome message for session "${id}"`);
                ws.resetTimeout = () => {
                    if (ws.keepaliveTimeout) {
                        clearTimeout(ws.keepaliveTimeout);
                    }
                    ws.keepaliveTimeout = setTimeout(() => {
                        eventManager.fire(
                            { type: "connection_lost" },
                            ws.subscriptions
                        );
                        delete this._connections[id];
                    }, keepalive_timeout_seconds * 1000 + 100);
                };
                ws.subscriptions = {};
                this._connections[id] = ws;
                ws.resetTimeout();
                onWelcome(id);
            } else if (message_type === "session_keepalive") {
                ws.resetTimeout();
            } else if (message_type === "session_reconnect") {
                const {
                    session: { id, reconnect_url },
                } = payload;
                logger.debug(`Received reconnect message for session "${id}"`);
                this._addConnection(
                    () => {
                        clearTimeout(ws.keepaliveTimeout);
                        ws.close();
                    },
                    reconnect_url,
                    eventManager
                );
            } else if (message_type === "notification") {
                ws.resetTimeout();
                const { subscription, event } = payload;
                logger.log(
                    `Received notification for type ${subscription.type}`
                );
                eventManager.fire(subscription, event);
            } else if (message_type === "revocation") {
                ws.resetTimeout();
                const { subscription } = payload;
                logger.log(
                    `Received revocation notification for subscription id ${subscription.id}`
                );
                eventManager.fire(
                    { ...subscription, type: "revocation" },
                    subscription
                );
                this.removeSubscription(subscription.id);
            } else {
                logger.log(
                    `Unhandled WebSocket message type "${message_type}"`
                );
            }
        };
        ws.onclose = (event) => {
            const [connectionID] =
                Object.entries(this._connections).find(
                    ([_id, value]) => value === ws
                ) || [];
            const { code, reason } = event;
            logger.debug(
                `WebSocket connection "${connectionID}" closed. ${code}:${reason}`
            );
            delete this._connections[connectionID];
        };
        return ws;
    }
}
