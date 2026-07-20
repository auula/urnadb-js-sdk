export default class ServerOptions {

    #endpoint;
    #port;
    #token;

    constructor({
        endpoint = '',
        port = 2668,
        token = '',
    } = {}) {
        this.#endpoint = endpoint;
        this.#port = port;
        this.#token = token;
    }

    baseUrl() {
        return `http://${this.#endpoint}:${this.#port}`;
    }
}
