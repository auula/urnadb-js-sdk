import { Claim } from "./claim.js";
import { Table } from "./table.js";
import { Variant } from "./variant.js";
import { Document } from "./document.js";
import { ServerOptions } from "./options.js";

export default class UrnaDB {

    #options;

    constructor(host, port, token, protocol = 'http') {
        this.host = host;
        this.port = port;
        this.token = token;
        this.protocol = protocol;

        this.#options = new ServerOptions({
            host: this.host,
            port: this.port,
            token: this.token,
            protocol: this.protocol
        });
    }

    static OpenConnection(opts) {

        const options = opts instanceof ServerOptions
            ? opts
            : new ServerOptions(opts);

        return new UrnaDB(
            options.host,
            options.port,
            options.token,
            options.protocol
        );
    }

    async createTable(name) {
        const response = await fetch(
            `${this.#options.baseUrl()}/tables/${name}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create table ${name}: ${result.message || response.statusText}`);
        }

        return result;
    }

    tables(name) {
        return new Table(
            name,
            this.#options
        );
    }

    documents(name) {
        return new Document(name, null, this.#options);
    }

    variants(name) {
        return new Variant(name, null, this.#options);
    }

    claims(name) {
        return new Claim(
            name,
            30
        );
    }

    // 批量保存文档和变体
    async save(...items) {
        let response = {};
        const promises = items.map(async (item) => {
            switch (item.constructor) {
                case Document:
                    response = await fetch(
                        `${this.#options.baseUrl()}/records/${item.name}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Auth-Token": this.#options.token
                            },
                            body: JSON.stringify({
                                record: item.build()
                            })
                        }
                    );
                    break;

                case Variant:
                    response = await fetch(
                        `${this.#options.baseUrl()}/variants/${item.name}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Auth-Token": this.#options.token
                            },
                            body: JSON.stringify({
                                variant: item.build()
                            })
                        }
                    );
                    break;

                default:
                    throw new Error(`Unsupported type: ${item.constructor.name}`);
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to save ${item.name}: ${result.message || response.statusText}`);
            }

            return result;
        });

        return Promise.all(promises);
    }

}
