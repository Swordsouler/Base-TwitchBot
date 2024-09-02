import "dotenv/config";
import { Streamer } from "./models/Users/Streamer";

new Streamer(
    process.env.TWITCH_STREAMER_ID,
    "",
    process.env.TWITCH_STREAMER_REFRESH_TOKEN
);
