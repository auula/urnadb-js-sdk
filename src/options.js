export class ServerOptions {
    #host;
    #port;
    #token;
    #protocol;

    constructor(options = {}) {
        if (options === null || typeof options !== "object" || Array.isArray(options)) {
            throw new TypeError("Server options must be an object");
        }

        const {
            host,
            port = 2668,
            token,
            protocol = "http"
        } = options;

        if (typeof host !== "string" || host.trim() === "") {
            throw new TypeError("host must be a non-empty string");
        }

        const domain = host.trim();

        try {
            const parsedHost = new URL(`http://${domain}`);

            if (
                parsedHost.username !== "" ||
                parsedHost.password !== "" ||
                parsedHost.port !== "" ||
                parsedHost.pathname !== "/" ||
                parsedHost.search !== "" ||
                parsedHost.hash !== ""
            ) {
                throw new TypeError();
            }
        } catch {
            throw new TypeError("host must contain only a hostname or IP address");
        }

        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new TypeError("port must be an integer between 1 and 65535");
        }

        if (typeof token !== "string" || token.trim() === "") {
            throw new TypeError("token must be a non-empty string");
        }

        if (protocol !== "http" && protocol !== "https") {
            throw new TypeError("protocol must be either http or https");
        }

        this.#host = domain;
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
