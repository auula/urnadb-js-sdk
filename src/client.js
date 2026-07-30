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

    // 统一使用单数形式
    table(name) {
        return new Table(
            name,
            this.#options.baseUrl(),
            this.#options.token
        );
    }

    document(name) {
        return new Document(name, {}, this.#options);
    }

    variant(name, value = null) {
        return new Variant(name, value, this.#options);
    }

    claim(name) {
        return new Claim(
            name,
            30
        );
    }

    // 批量保存文档和变体
    async save(...items) {
        const mutations = [];

        for (const item of items) {
            switch (item.constructor) {
                case Document:
                    
                    break;

                case Variant:

                    break;

                default:
                    throw new Error(`Unsupported item type: ${item.constructor.name}`);
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

        return response.json();
    }

}
