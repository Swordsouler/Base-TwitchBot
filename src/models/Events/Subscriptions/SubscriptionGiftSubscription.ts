import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type SubscriptionGiftData = {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    total: number;
    tier: string;
    cumulative_total: number;
    is_anonymous: boolean;
};
export class SubscriptionGiftSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: SubscriptionGiftData) => void
    ) {
        super(
            "channel.subscription.gift",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): SubscriptionGiftData {
        const userUsername = faker.internet.userName();
        const broadcasterUsername = faker.internet.userName();
        return {
            user_id: faker.string.uuid(),
            user_login: userUsername.toLowerCase(),
            user_name: userUsername,
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcasterUsername.toLowerCase(),
            broadcaster_user_name: broadcasterUsername,
            total: faker.number.int({ min: 1, max: 100 }),
            tier: faker.helpers.arrayElement(["1000", "2000", "3000"]),
            cumulative_total: faker.number.int({ min: 1, max: 1000 }),
            is_anonymous: faker.datatype.boolean(),
        };
    }
}
