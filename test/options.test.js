import test from "node:test";
import assert from "node:assert";

import ServerOptions from "../src/options.js";


test("ServerOptions should generate base url", () => {

    const options = new ServerOptions({
        endpoint: "192.168.31.221",
        port: 8080
    });


    assert.strictEqual(
        options.baseUrl(),
        "http://192.168.31.221:8080"
    );

});


test("private field cannot access", () => {

    const options = new ServerOptions({
        endpoint:"192.168.31.221"
    });


    assert.strictEqual(
        options.endpoint,
        undefined
    );

});