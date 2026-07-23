import test from "node:test";
import assert from "node:assert/strict";

import ServerOptions from "../src/options.js";


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


test("ServerOptions private fields should not be exposed", () => {

    const options = new ServerOptions({
        host: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });


    assert.equal(options.host, undefined);
    assert.equal(options.port, undefined);
    assert.equal(options.token, undefined);

});