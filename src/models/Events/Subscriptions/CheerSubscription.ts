import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type CheerData = {
    is_anonymous: string;
    user_id: string | null;
    user_login: string | null;
    user_name: string | null;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    message: string;
    bits: number;
};
export class CheerSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: CheerData) => void) {
        super(
            "channel.cheer",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): CheerData {
        const user_username = faker.internet.userName();
        const broadcaster_username = faker.internet.userName();
        return {
            is_anonymous: faker.datatype.boolean().toString(),
            user_id: faker.string.uuid(),
            user_login: user_username.toLowerCase(),
            user_name: user_username,
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            message: faker.lorem.sentence(),
            bits: faker.number.int({ min: 1, max: 10000 }),
        };
    }
}
