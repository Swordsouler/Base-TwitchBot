import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type PredictionEndData = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    title: string;
    winning_outcome_id: string;
    outcomes: {
        id: string;
        title: string;
        color: string;
        users: number;
        channel_points: number;
        top_predictors: {
            user_id: string;
            user_login: string;
            user_name: string;
            channel_points_won: number;
            channel_points_used: number;
        }[];
    }[];
    status: "resolved" | "canceled";
    started_at: string;
    ended_at: string;
};
export class PredictionEndSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: PredictionEndData) => void
    ) {
        super(
            "channel.prediction.end",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): PredictionEndData {
        const broadcaster_username = faker.internet.userName();
        return {
            id: faker.string.uuid(),
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            title: faker.lorem.sentence(),
            winning_outcome_id: faker.string.uuid(),
            outcomes: Array.from(
                { length: faker.number.int({ min: 2, max: 5 }) },
                () => ({
                    id: faker.string.uuid(),
                    title: faker.lorem.word(),
                    color: faker.internet.color(),
                    users: faker.number.int({ min: 0, max: 1000 }),
                    channel_points: faker.number.int({ min: 0, max: 100000 }),
                    top_predictors: Array.from(
                        { length: faker.number.int({ min: 0, max: 10 }) },
                        () => ({
                            user_id: faker.string.uuid(),
                            user_login: faker.internet.userName().toLowerCase(),
                            user_name: faker.internet.userName(),
                            channel_points_won: faker.number.int({
                                min: 0,
                                max: 10000,
                            }),
                            channel_points_used: faker.number.int({
                                min: 0,
                                max: 10000,
                            }),
                        })
                    ),
                })
            ),
            status: faker.helpers.arrayElement(["resolved", "canceled"]),
            started_at: faker.date.past().toISOString(),
            ended_at: new Date().toISOString(),
        };
    }
}
