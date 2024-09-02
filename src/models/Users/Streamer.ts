import { MessageSubscription } from "../Events/Subscriptions/MessageSubscription";
import { FollowSubscription } from "../Events/Subscriptions/FollowSubscription";
import { User } from "./User";
import { EventSubscription } from "../Events/Subscriptions/EventSubscription";
import { StreamOnlineSubscription } from "../Events/Subscriptions/StreamOnlineSubscription";
import { StreamOfflineSubscription } from "../Events/Subscriptions/StreamOfflineSubscription";
import { SubscribeSubscription } from "../Events/Subscriptions/SubscribeSubscription";
import { SubscriptionGiftSubscription } from "../Events/Subscriptions/SubscriptionGiftSubscription";
import { SubscriptionMessageSubscription } from "../Events/Subscriptions/SubscriptionMessageSubscription";
import { HypeTrainEndSubscription } from "../Events/Subscriptions/HypeTrainEndSubscription";
import { PollEndSubscription } from "../Events/Subscriptions/PollEndSubscription";
import { PredictionEndSubscription } from "../Events/Subscriptions/PredictionEndSubscription";
import { CheerSubscription } from "../Events/Subscriptions/CheerSubscription";
import { RaidSubscription } from "../Events/Subscriptions/RaidSubscription";
import { ChannelPointsCustomRewardRedemptionAddSubscription } from "../Events/Subscriptions/ChannelPointsCustomRewardRedemptionAddSubscription";
import { BanSubscription } from "../Events/Subscriptions/BanSubscription";
const TES = require("tesjs");

export class Streamer extends User {
    private tes: any;

    constructor(userId: string, displayName?: string, refreshToken?: string) {
        super(userId, displayName, refreshToken);
        this.userId = userId;
        this.refreshToken = refreshToken;
    }

    protected onReady(): void {
        super.onReady();
        //this.checkLiveStream();
        this.connect();
    }

    public async connect() {
        try {
            this.tes = new TES({
                identity: {
                    id: process.env.TWITCH_CLIENT_ID,
                    secret: process.env.TWITCH_CLIENT_SECRET,
                    accessToken: this.accessToken,
                    refreshToken: this.refreshToken,
                    onAuthenticationFailure: async () => {
                        const accessToken = await this.refreshAccessToken();
                        return accessToken;
                    },
                },
                listener: {
                    type: "websocket",
                },
                options: {
                    debug: false,
                    logging: false,
                },
            });
        } catch (e) {
            console.error(e);
        }

        const subscriptions = await this.tes.getSubscriptions();
        for (const subscription of await subscriptions["data"]) {
            if (subscription.status === "websocket_disconnected") {
                await this.tes.unsubscribe(subscription.id);
            }
        }
        this.subscribeToAllEvents();
    }

    private async checkLiveStream() {
        const response = await fetch(
            `https://api.twitch.tv/helix/streams?user_id=${this.userId}`,
            {
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );
        const data = await response.json();
        if (data.data.length > 0) {
            console.log(`${this.displayName} is live!`);
            // later shall load point from streamblade api
        } else {
            console.log(`${this.displayName} is offline!`);
        }
    }

    public async subscribe(
        event: EventSubscription,
        retry: boolean = true
    ): Promise<any> {
        try {
            const sub = await this.tes.subscribe(
                event.type,
                event.condition,
                event.version
            );
            await this.tes.on(event.type, event.callback);
            console.log(`Subscribed to ${event.type} for ${this.displayName}`);
            return sub;
        } catch (e) {
            console.error(this.userId, `(${this.displayName})`, event.type, e);
            if (
                retry &&
                e.message !==
                    "403 Forbidden: subscription missing proper authorization"
            )
                setTimeout(async () => {
                    console.log("Retrying to subscribe to " + event.type);
                    await this.subscribe(event, false);
                }, 120000);
        }
    }

    public async unsubscribe(subscription: any): Promise<void> {
        await this.tes.unsubscribe(subscription);
    }

    private eventsSubscriptions: Record<string, EventSubscription> = {
        "stream.online": new StreamOnlineSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "stream.offline": new StreamOfflineSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.subscribe": new SubscribeSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.subscription.gift": new SubscriptionGiftSubscription(
            this.userId,
            (data) => {
                console.log(data);
            }
        ),
        "channel.subscription.message": new SubscriptionMessageSubscription(
            this.userId,
            (data) => {
                console.log(data);
            }
        ),
        "channel.hype_train.end": new HypeTrainEndSubscription(
            this.userId,
            (data) => {
                console.log(data);
            }
        ),
        "channel.poll.end": new PollEndSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.prediction.end": new PredictionEndSubscription(
            this.userId,
            (data) => {
                console.log(data);
            }
        ),
        "channel.chat.message": new MessageSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.cheer": new CheerSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.raid": new RaidSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.channel_points_custom_reward_redemption.add":
            new ChannelPointsCustomRewardRedemptionAddSubscription(
                this.userId,
                (data) => {
                    console.log(data);
                }
            ),
        "channel.follow": new FollowSubscription(this.userId, (data) => {
            console.log(data);
        }),
        "channel.ban": new BanSubscription(this.userId, (data) => {
            console.log(data);
        }),
    };

    private subscribeToAllEvents() {
        for (const event in this.eventsSubscriptions) {
            this.subscribe(this.eventsSubscriptions[event]);
        }

        // TRIGGER RANDOM EVENTS
        /*setInterval(() => {
            // trigger a random event
            const events = Object.keys(this.eventsSubscriptions);
            const randomEvent =
                events[Math.floor(Math.random() * events.length)];
            // if not stream.online or stream.offline
            if (
                randomEvent !== "stream.online" &&
                randomEvent !== "stream.offline"
            )
                this.eventsSubscriptions[randomEvent].triggerRandomEvent();
        }, 1000);

        this.eventsSubscriptions["stream.online"].triggerRandomEvent();
        setTimeout(() => {
            this.eventsSubscriptions["stream.offline"].triggerRandomEvent();
        }, 30000);*/
    }

    public stop() {
        this.tes.disconnect();
        console.log(`Disconnected from ${this.displayName}`);
    }
}
