import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";


const require = createRequire(import.meta.url);


test("root entry should support default and named imports", async () => {

    const sdk = await import("urnadb-js-sdk");

    assert.equal(sdk.default, sdk.UrnaDB);

    for (const expname of [
        "UrnaDB",
        "ServerOptions",
        "Variant",
        "Document",
        "Table",
        "Claim"
    ]) {
        assert.equal(typeof sdk[expname], "function");
    }

    const options = new sdk.ServerOptions({
        host: "192.168.3.20",
        port: 2668,
        token: "connection-secret-token"
    });

    const db = sdk.UrnaDB.OpenConnection(options);

    assert.ok(db instanceof sdk.UrnaDB);

});


test("table subpath should expose the public table API", async () => {

    const [sdk, tab] = await Promise.all([
        import("urnadb-js-sdk"),
        import("urnadb-js-sdk/table")
    ]);

    assert.equal(tab.Table, sdk.Table);
    assert.equal("TableRowsBuilder" in sdk, false);
    assert.equal("TableRowsPatcher" in sdk, false);
    assert.equal("TableRowsBuilder" in tab, false);
    assert.equal("TableRowsPatcher" in tab, false);

    assert.deepEqual(tab.OperationType, {
        INSERT: "INSERT",
        UPDATE: "UPDATE",
        REMOVE: "REMOVE"
    });

    assert.equal(Object.isFrozen(tab.OperationType), true);

});


test("unlisted source subpaths should remain private", async () => {

    await assert.rejects(
        import("urnadb-js-sdk/src/table.js"),
        {
            code: "ERR_PACKAGE_PATH_NOT_EXPORTED"
        }
    );

});


test("CommonJS require should be rejected", () => {

    assert.throws(
        () => require("urnadb-js-sdk"),
        {
            code: "ERR_PACKAGE_PATH_NOT_EXPORTED"
        }
    );

});
