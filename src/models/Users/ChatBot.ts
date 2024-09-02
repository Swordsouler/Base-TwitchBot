import { Streamer } from "./Streamer";
import { User } from "./User";

export class ChatBot extends User {
    private onReadyCallbacks: (() => void)[] = [];

    constructor(userId: string, refreshToken: string) {
        super(userId, "", refreshToken);
    }

    protected onReady(): void {
        super.onReady();
        this.onReadyCallbacks.forEach((callback) => callback());
    }

    public OnReady(callback: () => void) {
        if (this.ready) {
            callback();
        } else {
            this.onReadyCallbacks.push(callback);
        }
    }

    public async sendChatMessage(streamer: Streamer, message: string) {
        if (!this.ready) {
            console.error("ChatBot not ready");
            return;
        }
        const result = await fetch(
            "https://api.twitch.tv/helix/chat/messages",
            {
                method: "POST",
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    broadcaster_id: streamer.userId,
                    sender_id: this.userId,
                    message: message,
                }),
            }
        );
        if (!result.ok) {
            const data = await result.json();
            console.error(`Failed to send message to ${streamer.userId}`, data);
        }
    }
}

export const Bot = new ChatBot(
    process.env.TWITCH_BOT_ID,
    process.env.TWITCH_BOT_REFRESH_TOKEN
);
