export default class ServerOptions {

    #host;
    #port;
    #token;

    constructor({
        host = '',
        port = 2668,
        token = '',
    } = {}) {
        this.#host = host;
        this.#port = port;
        this.#token = token;
    }

    baseUrl() {
        return `http://${this.#host}:${this.#port}`;
    }
}
