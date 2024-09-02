import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type ChannelPointsCustomRewardRedemptionAddData = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    user_id: string;
    user_login: string;
    user_name: string;
    user_input: string;
    status: "unfulfilled" | "unknown" | "fulfilled" | "canceled";
    reward: {
        id: string;
        title: string;
        cost: number;
        prompt: string;
    };
    redeemed_at: string;
};
export class ChannelPointsCustomRewardRedemptionAddSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: ChannelPointsCustomRewardRedemptionAddData) => void
    ) {
        super(
            "channel.channel_points_custom_reward_redemption.add",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): ChannelPointsCustomRewardRedemptionAddData {
        const user_username = faker.internet.userName();
        const broadcaster_username = faker.internet.userName();
        return {
            id: faker.string.uuid(),
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            user_id: faker.string.uuid(),
            user_login: user_username.toLowerCase(),
            user_name: user_username,
            user_input: faker.lorem.sentence(),
            status: faker.helpers.arrayElement([
                "unfulfilled",
                "unknown",
                "fulfilled",
                "canceled",
            ]),
            reward: {
                id: faker.string.uuid(),
                title: faker.lorem.words(),
                cost: faker.number.int(),
                prompt: faker.lorem.sentence(),
            },
            redeemed_at: new Date().toISOString(),
        };
    }
}
