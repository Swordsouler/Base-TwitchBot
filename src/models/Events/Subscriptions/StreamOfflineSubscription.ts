import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type StreamOfflineData = {
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
};
export class StreamOfflineSubscription extends EventSubscription {
    constructor(
        broadcasterId: string,
        callback: (data: StreamOfflineData) => void
    ) {
        super(
            "stream.offline",
            {
                broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): StreamOfflineData {
        const broadcaster_username = faker.internet.userName();
        return {
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
        };
    }
}
