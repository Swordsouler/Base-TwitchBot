// Copyright (c) 2022 Mitchell Adair
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AuthManager } from "./auth";
import { logger } from "./logger";

export class RequestManager {
    constructor() {}

    /**
     *
     * @param {string} url the url to fetch
     * @param {object} config fetch config object
     * @param {boolean} json whether or not to parse response as JSON
     *                       if false, parse as text
     */
    static async request(
        url: string | URL | Request,
        config: RequestInit,
        json: boolean = true,
        auth: AuthManager
    ) {
        const r = async () => {
            const res = await fetch(url, config);
            if (res.status === 401) {
                logger.debug(
                    "Request received 401 unauthorized response. Refreshing token and retrying..."
                );
                try {
                    await auth.refreshToken();
                } catch (err) {
                    if (!err.message.includes("web client")) {
                        throw err;
                    }
                    return res.json();
                }
                config.headers[
                    "Authorization"
                ] = `Bearer ${await auth.getToken()}`;
                return r();
            } else {
                if (json) {
                    return res.json();
                } else {
                    return res.text();
                }
            }
        };
        return r();
    }
}
