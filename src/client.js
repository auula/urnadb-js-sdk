import { Table } from "./table.js";
import { Variant } from "./variant.js";
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

    variant(name, value = {}) {
        return new Variant(
            name,
            value
        );
    }

}
