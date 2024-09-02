import { faker } from "@faker-js/faker";
import { EventSubscription } from "./EventSubscription";

export type MessageData = {
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    chatter_user_id: string;
    chatter_user_login: string;
    chatter_user_name: string;
    message_id: string;
    message: {
        text: string;
        fragments: {
            type: "text" | "cheeremote" | "emote" | "mention";
            text: string;
            cheermote?: {
                prefix: string;
                bits: number;
                tier: number;
            };
            emote?: {
                id: string;
                emote_set_id: string;
                owner_id: string;
                format: ("animated" | "static")[];
            };
            mention?: {
                user_id: string;
                user_name: string;
                user_login: string;
            };
        }[];
    };
    message_type: string;
    badges: {
        set_id: string;
        id: string;
        info: string;
    }[];
    cheer?: {
        bits: number;
    };
    color: string;
    reply?: {
        parent_message_id: string;
        parent_message_body: string;
        parent_user_id: string;
        parent_user_name: string;
        parent_user_login: string;
        thread_message_id: string;
        thread_user_id: string;
        thread_user_name: string;
        thread_user_login: string;
    };
    channel_points_custom_reward_id?: string;
    channel_points_animation_id?: string;
};
export class MessageSubscription extends EventSubscription {
    constructor(broadcasterId: string, callback: (data: MessageData) => void) {
        super(
            "channel.chat.message",
            {
                broadcaster_user_id: broadcasterId,
                user_id: broadcasterId,
            },
            "1",
            callback
        );
    }

    protected generateRandomData(): MessageData {
        const user_username = faker.internet.userName();
        const broadcaster_username = faker.internet.userName();
        return {
            broadcaster_user_id: faker.string.uuid(),
            broadcaster_user_login: broadcaster_username.toLowerCase(),
            broadcaster_user_name: broadcaster_username,
            chatter_user_id: faker.string.uuid(),
            chatter_user_login: user_username.toLowerCase(),
            chatter_user_name: user_username,
            message_id: faker.string.uuid(),
            message: {
                text: faker.lorem.sentence(),
                fragments: Array.from(
                    { length: faker.number.int({ min: 1, max: 5 }) },
                    () => ({
                        type: faker.helpers.arrayElement([
                            "text",
                            "cheeremote",
                            "emote",
                            "mention",
                        ]),
                        text: faker.lorem.word(),
                        cheermote: faker.helpers.arrayElement([
                            undefined,
                            {
                                prefix: faker.lorem.word(),
                                bits: faker.number.int({
                                    min: 1,
                                    max: 1000,
                                }),
                                tier: faker.number.int({ min: 1, max: 3 }),
                            },
                        ]),
                        emote: faker.helpers.arrayElement([
                            undefined,
                            {
                                id: faker.string.uuid(),
                                emote_set_id: faker.string.uuid(),
                                owner_id: faker.string.uuid(),
                                format: faker.helpers.arrayElements([
                                    "animated",
                                    "static",
                                ]),
                            },
                        ]),
                        mention: faker.helpers.arrayElement([
                            undefined,
                            {
                                user_id: faker.string.uuid(),
                                user_name: faker.internet.userName(),
                                user_login: faker.internet
                                    .userName()
                                    .toLowerCase(),
                            },
                        ]),
                    })
                ),
            },
            message_type: faker.lorem.word(),
            badges: Array.from(
                { length: faker.number.int({ min: 0, max: 3 }) },
                () => ({
                    set_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    info: faker.lorem.word(),
                })
            ),
            cheer: faker.helpers.arrayElement([
                undefined,
                {
                    bits: faker.number.int({ min: 1, max: 1000 }),
                },
            ]),
            color: faker.internet.color(),
            reply: faker.helpers.arrayElement([
                undefined,
                {
                    parent_message_id: faker.string.uuid(),
                    parent_message_body: faker.lorem.sentence(),
                    parent_user_id: faker.string.uuid(),
                    parent_user_name: faker.internet.userName(),
                    parent_user_login: faker.internet.userName().toLowerCase(),
                    thread_message_id: faker.string.uuid(),
                    thread_user_id: faker.string.uuid(),
                    thread_user_name: faker.internet.userName(),
                    thread_user_login: faker.internet.userName().toLowerCase(),
                },
            ]),
            channel_points_custom_reward_id: faker.helpers.arrayElement([
                undefined,
                faker.string.uuid(),
            ]),
            channel_points_animation_id: faker.helpers.arrayElement([
                undefined,
                faker.string.uuid(),
            ]),
        };
    }
}
