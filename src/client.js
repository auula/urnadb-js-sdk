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

    tables(name) {
        return new Table(
            name,
            this.#options.baseUrl(),
            this.#options.token
        );
    }

    documents(name) {
        return new Document(name, {}, this.#options);
    }

    variants(name, value = null) {
        return new Variant(name, value, this.#options);
    }

    claims(name) {
        return new Claim(
            name,
            30
        );
    }

    // 批量保存文档和变体
    async save(...items) {
        const results = [];

        const promises = items.map(async (item) => {
            let response;
            
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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to save ${item.name}: ${error.message || response.statusText}`);
            }

            return response.json();
        });

        return Promise.all(promises);
    }

}
