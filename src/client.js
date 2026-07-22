import TableBuiler from "./table";

export default class Client {

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

    OpenConnection(opts) {
        this.#options = opts instanceof ServerOptions
            ? opts
            : new ServerOptions(opts);
        return this;
    }

    createTable(name, ttl) {

    }

    tables(name) {
        return new Table(name);
    }

}