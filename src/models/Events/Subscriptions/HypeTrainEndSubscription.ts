import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type HypeTrainEndData = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    level: number;
    total: number;
    top_contributions: {
        user_id: string;
        user_login: string;
        user_name: string;
        type: "bits" | "subscription" | "other";
        total: number;
    }[];
    started_at: string;
    ended_at: string;
    cooldown_ends_at: string;
};
export class HypeTrainEndSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: HypeTrainEndData) => void
    ) {
        super(
            "channel.hype_train.end",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): HypeTrainEndData {
        const broadcaster_username = faker.internet.userName();
        return {
            id: faker.string.uuid(),
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            level: faker.number.int({ min: 1, max: 5 }),
            total: faker.number.int({ min: 1000, max: 100000 }),
            top_contributions: Array.from({ length: 3 }, () => ({
                user_id: faker.string.uuid(),
                user_login: faker.internet.userName().toLowerCase(),
                user_name: faker.internet.userName(),
                type: faker.helpers.arrayElement([
                    "bits",
                    "subscription",
                    "other",
                ]),
                total: faker.number.int({ min: 100, max: 10000 }),
            })),
            started_at: faker.date.past().toISOString(),
            ended_at: new Date().toISOString(),
            cooldown_ends_at: faker.date.recent().toISOString(),
        };
    }
}
