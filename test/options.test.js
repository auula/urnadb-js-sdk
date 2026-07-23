import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { ServerOptions } from "urnadb-js-sdk";


test("ServerOptions should generate base URL", () => {

    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });


    assert.equal(
        options.baseUrl(),
        "https://192.168.31.221:2668"
    );

});


test("ServerOptions should expose read-only values without enumerable storage", () => {

    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });


    assert.equal(options.host, "192.168.31.221");
    assert.equal(options.port, 2668);
    assert.equal(options.token, "connection-secret-token");
    assert.deepEqual(Object.keys(options), []);

});


test("UrnaDB should accept a ServerOptions instance", () => {

    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });

    const db = UrnaDB.OpenConnection(options);

    assert.equal(db.host, options.host);
    assert.equal(db.port, options.port);
    assert.equal(db.token, options.token);

});
