import { getBinding } from "./bindings.js";

export class Claim {

    #name;
    #ttl;
    #token = null;
    #heartbeat = null;

    constructor(name, ttl = 30) {
        this.#name = name;
        this.#ttl = ttl;
    }

    get name() {
        return this.#name;
    }

    static acquire(name, seconds = 30) {
        return new Claim(name, seconds);
    }

    async acquire() {
        const options = getBinding(this);

        if (!options) {
            throw new Error("Claim operations are only available through db.claims()");
        }

        const response = await fetch(
            `${options.baseUrl()}/locks/${this.#name}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": options.token
                },
                body: JSON.stringify({ ttl: this.#ttl })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to acquire lock ${this.#name}: ${result.message || response.statusText}`
            );
        }

        this.#token = result?.data?.token ?? null;

        this.#startHeartbeat();

        return this;
    }

    async extend() {
        const options = getBinding(this);

        if (!options) {
            throw new Error("Claim operations are only available through db.claims()");
        }

        if (this.#token === null) {
            throw new Error(`Failed to extend lock ${this.#name}: lock not acquired`);
        }

        const response = await fetch(
            `${options.baseUrl()}/locks/${this.#name}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": options.token
                },
                body: JSON.stringify({ token: this.#token })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to extend lock ${this.#name}: ${result.message || response.statusText}`
            );
        }

        this.#token = result?.data?.token ?? this.#token;

        return this;
    }

    async release() {
        this.#stopHeartbeat();

        if (this.#token === null) {
            return true;
        }

        const options = getBinding(this);

        if (!options) {
            this.#token = null;
            return true;
        }

        const token = this.#token;
        this.#token = null;

        const response = await fetch(
            `${options.baseUrl()}/locks/${this.#name}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": options.token
                },
                body: JSON.stringify({ token })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to release lock ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return true;
    }

    async using(callback) {
        await this.acquire();
        let error = null;
        try {
            await callback(this);
        } catch (e) {
            error = e;
        }
        await this.release().catch((e) => {
            if (error === null) error = e;
        });
        if (error !== null) throw error;
        return this;
    }

    #startHeartbeat() {
        this.#stopHeartbeat();

        const interval = Math.ceil((this.#ttl * 1000) / 3);

        this.#heartbeat = setInterval(() => {
            this.extend()
                .catch(() => this.#stopHeartbeat());
        }, interval);

        if (this.#heartbeat.unref) {
            this.#heartbeat.unref();
        }
    }

    #stopHeartbeat() {
        if (this.#heartbeat !== null) {
            clearInterval(this.#heartbeat);
            this.#heartbeat = null;
        }
    }
}
