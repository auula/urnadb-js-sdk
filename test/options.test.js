import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { ServerOptions } from "urnadb-js-sdk";


test("should generate base URL", () => {
    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });


    assert.equal(
        options.baseUrl(),
        "http://192.168.31.221:2668"
    );
});


test("should expose read-only values without enumerable storage", () => {
    const options = ServerOptions.builder()
        .host("192.168.31.221")
        .port(2668)
        .token("connection-secret-token")
        .protocol("https")
        .build();


    assert.equal(options.host, "192.168.31.221");
    assert.equal(options.port, 2668);
    assert.equal(options.token, "connection-secret-token");
    assert.equal(options.protocol, "https");
    
    assert.deepEqual(Object.keys(options), []);
});


test("should accept a ServerOptions instance", () => {
    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });

    const db = UrnaDB.OpenConnection(options);

    assert.equal(db.host, options.host);
    assert.equal(db.port, options.port);
    assert.equal(db.token, options.token);

    assert.ok(db.options instanceof ServerOptions);

    assert.equal(db.options.host, options.host);
    assert.equal(db.options.port, options.port);
    assert.equal(db.options.token, options.token);
    assert.equal(db.options.protocol, options.protocol);
});


test("should normalize the host and preserve defaults", () => {
    const options = new ServerOptions({
        host: "  localhost  ",
        token: "connection-secret-token"
    });

    assert.equal(options.host, "localhost");
    assert.equal(options.port, 2668);
    assert.equal(options.protocol, "http");
    assert.equal(options.baseUrl(), "http://localhost:2668");
});


test("should reject invalid server options", () => {
    const invalidOptions = [
        [undefined, "host must be a non-empty string"],
        [null, "Server options must be an object"],
        [[], "Server options must be an object"],
        [{ host: "", token: "token" }, "host must be a non-empty string"],
        [{ host: 127, token: "token" }, "host must be a non-empty string"],
        [{ host: "http://localhost", token: "token" }, "host must contain only a hostname or IP address"],
        [{ host: "localhost:2668", token: "token" }, "host must contain only a hostname or IP address"],
        [{ host: "localhost/database", token: "token" }, "host must contain only a hostname or IP address"],
        [{ host: "localhost", token: "" }, "token must be a non-empty string"],
        [{ host: "localhost", token: 123 }, "token must be a non-empty string"],
        [{ host: "localhost", token: "token", port: 0 }, "port must be an integer between 1 and 65535"],
        [{ host: "localhost", token: "token", port: 65536 }, "port must be an integer between 1 and 65535"],
        [{ host: "localhost", token: "token", port: 2668.5 }, "port must be an integer between 1 and 65535"],
        [{ host: "localhost", token: "token", protocol: "ftp" }, "protocol must be either http or https"]
    ];

    for (const [options, message] of invalidOptions) {
        assert.throws(
            () => new ServerOptions(options),
            { name: "TypeError", message }
        );
    }
});


test("should validate options built with ServerOptionsBuilder", () => {
    assert.throws(
        () => ServerOptions.builder().host("localhost").build(),
        {
            name: "TypeError",
            message: "token must be a non-empty string"
        }
    );
});
