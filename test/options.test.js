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
