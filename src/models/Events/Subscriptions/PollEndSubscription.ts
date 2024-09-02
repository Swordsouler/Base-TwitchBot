import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type PollEndData = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    title: string;
    choices: {
        id: string;
        title: string;
        bits_votes: number;
        channel_points_votes: number;
        votes: number;
    }[];
    bits_voting: {
        is_enabled: boolean;
        amount_per_vote: number;
    };
    channel_points_voting: {
        is_enabled: boolean;
        amount_per_vote: number;
    };
    status: "completed" | "archived" | "terminated";
    started_at: string;
    ended_at: string;
};
export class PollEndSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: PollEndData) => void) {
        super(
            "channel.poll.end",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): PollEndData {
        const broadcaster_username = faker.internet.userName();
        return {
            id: faker.string.uuid(),
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            title: faker.lorem.sentence(),
            choices: Array.from(
                { length: faker.number.int({ min: 2, max: 5 }) },
                () => ({
                    id: faker.string.uuid(),
                    title: faker.lorem.word(),
                    bits_votes: faker.number.int({ min: 0, max: 1000 }),
                    channel_points_votes: faker.number.int({
                        min: 0,
                        max: 1000,
                    }),
                    votes: faker.number.int({ min: 0, max: 2000 }),
                })
            ),
            bits_voting: {
                is_enabled: faker.datatype.boolean(),
                amount_per_vote: faker.number.int({ min: 1, max: 100 }),
            },
            channel_points_voting: {
                is_enabled: faker.datatype.boolean(),
                amount_per_vote: faker.number.int({ min: 1, max: 100 }),
            },
            status: faker.helpers.arrayElement([
                "completed",
                "archived",
                "terminated",
            ]),
            started_at: faker.date.past().toISOString(),
            ended_at: new Date().toISOString(),
        };
    }
}
