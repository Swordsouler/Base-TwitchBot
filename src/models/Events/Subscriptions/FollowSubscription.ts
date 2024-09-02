import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type FollowData = {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    followed_at: string;
};
export class FollowSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: FollowData) => void) {
        super(
            "channel.follow",
            {
                broadcaster_user_id: broadcasterId,
                moderator_user_id: broadcasterId,
            },
            "2",
            callback
        );
    }
    protected generateRandomData(): FollowData {
        const user_username = faker.internet.userName();
        const broadcaster_username = faker.internet.userName();
        return {
            user_id: faker.string.uuid(),
            user_login: user_username.toLowerCase(),
            user_name: user_username,
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            followed_at: new Date().toISOString(),
        };
    }
}
