export class ServerOptions {
    #host;
    #port;
    #token;
    #protocol;

    constructor({
        host = '',
        port = 2668,
        token = '',
        protocol = 'http'
    } = {}) {
        this.#host = host;
        this.#port = port;
        this.#token = token;
        this.#protocol = protocol;
    }

    get host() {
        return this.#host;
    }

    get port() {
        return this.#port;
    }

    get token() {
        return this.#token;
    }

    get protocol() {
        return this.#protocol;
    }

    baseUrl() {
        return `${this.#protocol}://${this.#host}:${this.#port}`;
    }

    static builder() {
        return new ServerOptionsBuilder();
    }

}


export class ServerOptionsBuilder {

    #options = {};

    host(value) {
        this.#options.host = value;
        return this;
    }

    port(value) {
        this.#options.port = value;
        return this;
    }

    token(value) {
        this.#options.token = value;
        return this;
    }

    protocol(value) {
        this.#options.protocol = value;
        return this;
    }

    build() {
        return new ServerOptions(this.#options);
    }
}
