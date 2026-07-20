import test from "node:test";
import assert from "node:assert";

import ServerOptions from "../src/options.js";


test("ServerOptions baseUrl", () => {

    const options = new ServerOptions({
        endpoint: "192.168.31.221",
        port: 2668,
        token: "connection-secret-token"
    });


    assert.strictEqual(
        options.baseUrl(),
        "http://192.168.31.221:2668"
    );

});


test("Private field cannot access", () => {

    const options = new ServerOptions({
        endpoint: "192.168.31.221",
    });

    assert.strictEqual(
        options.endpoint,
        undefined
    );
});