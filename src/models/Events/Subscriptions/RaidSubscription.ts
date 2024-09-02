import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type RaidData = {
    from_broadcaster_user_id: string;
    from_broadcaster_user_login: string;
    from_broadcaster_user_name: string;
    to_broadcaster_user_id: string;
    to_broadcaster_user_login: string;
    to_broadcaster_user_name: string;
    viewers: number;
};
export class RaidSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: RaidData) => void) {
        super(
            "channel.raid",
            {
                to_broadcaster_user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): RaidData {
        const from_broadcaster_username = faker.internet.userName();
        const to_broadcaster_username = faker.internet.userName();
        return {
            from_broadcaster_user_id: faker.string.uuid(),
            from_broadcaster_user_login:
                from_broadcaster_username.toLowerCase(),
            from_broadcaster_user_name: from_broadcaster_username,
            to_broadcaster_user_id: faker.string.uuid(),
            to_broadcaster_user_login: to_broadcaster_username.toLowerCase(),
            to_broadcaster_user_name: to_broadcaster_username,
            viewers: faker.number.int({ min: 1, max: 10000 }),
        };
    }
}
