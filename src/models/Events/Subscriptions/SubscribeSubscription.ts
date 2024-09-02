import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type SubscribeData = {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    tier: string;
    is_gift: boolean;
};
export class SubscribeSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: SubscribeData) => void
    ) {
        super(
            "channel.subscribe",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): SubscribeData {
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
            is_gift: faker.datatype.boolean(),
        };
    }
}
