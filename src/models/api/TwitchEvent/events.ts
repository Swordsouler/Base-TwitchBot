import { AuthManager } from "./auth";
import { logger } from "./logger";
import { RequestManager } from "./request";

export class EventManager {
    _events: Record<string, (data: any, sub: any) => void>;
    _subscriptionQueue: Record<
        string,
        {
            data: any;
            resolve: (data: any) => void;
            timeout: NodeJS.Timeout;
        }
    >;

    constructor() {
        this._events = this._events || {};
        this._subscriptionQueue = this._subscriptionQueue || {};
    }

    fire(sub: { type: string | number }, data: any) {
        const handler = this._events[sub.type];
        if (!handler) {
            logger.warn(`Recieved event for unhandled type: ${sub.type}`);
            return false;
        } else {
            handler.call(this, data, sub);
            return true;
        }
    }

    addListener(type: string | number, handler: (data: any, sub: any) => void) {
        if (typeof handler !== "function") {
            throw TypeError("Event handler must be a function");
        }

        this._events[type] = handler;
        return this;
    }

    removeListener(type: string | number) {
        if (this._events[type]) {
            delete this._events[type];
        }

        return this;
    }

    clearListeners() {
        this._events = {};
    }

    removeAllListeners() {
        this._events = {};
        return this;
    }

    queueSubscription(
        data: { data: { id: any }[] },
        resolve: any,
        reject: (arg0: { message: string; subscriptionID: any }) => void
    ) {
        const id = data.data[0].id;
        this._subscriptionQueue[id] = {
            data,
            resolve,
            timeout: setTimeout(() => {
                reject({
                    message:
                        "Subscription verification timed out, this will need to be cleaned up",
                    subscriptionID: id,
                });
                delete this._subscriptionQueue[id];
            }, 600000),
        };
        return this;
    }

    resolveSubscription(id: string | number) {
        if (!this._subscriptionQueue[id]) {
            return this;
        }

        const { resolve, timeout, data } = this._subscriptionQueue[id];
        clearTimeout(timeout);
        resolve(data);
        delete this._subscriptionQueue[id];
        return this;
    }
}
