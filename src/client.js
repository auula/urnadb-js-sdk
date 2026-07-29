import { Claim } from "./claim.js";
import { Table } from "./table.js";
import { Variant } from "./variant.js";
import { Document } from "./document.js";
import { ServerOptions } from "./options.js";

export default class UrnaDB {

    #options;

    constructor(host, port, token) {
        this.host = host;
        this.port = port;
        this.token = token;

        this.#options = new ServerOptions({
            host: this.host,
            port: this.port,
            token: this.token
        });
    }

    static OpenConnection(opts) {

        const options = opts instanceof ServerOptions
            ? opts
            : new ServerOptions(opts);

        return new UrnaDB(
            options.host,
            options.port,
            options.token
        );
    }

    createTable(name, ttl = null) {
        return name;
    }

    tables(name = null) {
        return new Table(
            name,
            this.#options.baseUrl(),
            this.#options.token
        );
    }

    document(name) {
        return new Document(name);
    }

    variant(name, value = {}) {
        return new Variant(
            name,
            value
        );
    }

    claims(name) {
        return new Claim(
            name,
            30
        );
    }

    save(...items) {
        for (const item of items) {
            switch (item.constructor) {
                case Document:
                    break;

                case Variant:
                    break;

                default:
                    throw new Error(`Unknown support type: ${item.constructor.name}`);
            }
        }

        // 发送批量请求
        const response = await fetch(
            `${this.#options.baseUrl()}/batch`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.#options.token}`
                },
                body: JSON.stringify({ mutations })
            }
        );
    }

}
