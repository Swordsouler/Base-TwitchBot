import { EventSubscription } from "./EventSubscription";
import { faker } from "@faker-js/faker";

export type BanData = {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    moderator_user_id: string;
    moderator_user_login: string;
    moderator_user_name: string;
    reason: string;
    banned_at: string;
    ends_at: string;
    is_permanent: boolean;
};
export class BanSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: BanData) => void) {
        super(
            "channel.ban",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): BanData {
        const user_username = faker.internet.userName();
        const broadcaster_username = faker.internet.userName();
        const moderator_username = faker.internet.userName();
        return {
            user_id: faker.string.uuid(),
            user_login: user_username.toLowerCase(),
            user_name: user_username,
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            moderator_user_id: faker.string.uuid(),
            moderator_user_login: moderator_username.toLowerCase(),
            moderator_user_name: moderator_username,
            reason: faker.lorem.sentence(),
            banned_at: new Date().toISOString(),
            ends_at: faker.date.future().toISOString(),
            is_permanent: faker.datatype.boolean(),
        };
    }
}
