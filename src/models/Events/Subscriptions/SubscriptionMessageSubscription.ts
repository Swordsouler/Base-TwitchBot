import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type SubscriptionMessageData = {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    tier: string;
    message: {
        text: string;
        emotes: {
            begin: number;
            end: number;
            id: string;
        }[];
    };
    cumulative_months: number;
    streak_months: number;
    duration_months: number;
};
export class SubscriptionMessageSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: SubscriptionMessageData) => void
    ) {
        super(
            "channel.subscription.message",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): SubscriptionMessageData {
        const userUsername = faker.internet.userName();
        const broadcasterUsername = faker.internet.userName();
        return {
            user_id: faker.string.uuid(),
            user_login: userUsername.toLowerCase(),
            user_name: userUsername,
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcasterUsername.toLowerCase(),
            broadcaster_user_name: broadcasterUsername,
            tier: faker.helpers.arrayElement(["1000", "2000", "3000"]),
            message: {
                text: faker.lorem.sentence(),
                emotes: Array.from(
                    { length: faker.number.int({ min: 1, max: 5 }) },
                    () => ({
                        begin: faker.number.int({ min: 0, max: 20 }),
                        end: faker.number.int({ min: 21, max: 40 }),
                        id: faker.string.uuid(),
                    })
                ),
            },
            cumulative_months: faker.number.int({ min: 1, max: 60 }),
            streak_months: faker.number.int({ min: 1, max: 60 }),
            duration_months: faker.number.int({ min: 1, max: 12 }),
        };
    }
}
