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

    assert.equal("bind" in sdk, false);
    assert.equal("getBinding" in sdk, false);

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
    assert.equal("OperationType" in tab, false);

});


test("unlisted source subpaths should remain private", async () => {

    for (const subpath of [
        "urnadb-js-sdk/src/table.js",
        "urnadb-js-sdk/src/bindings.js",
        "urnadb-js-sdk/bindings"
    ]) {
        await assert.rejects(
            import(subpath),
            {
                code: "ERR_PACKAGE_PATH_NOT_EXPORTED"
            }
        );
    }

});


test("CommonJS require should be rejected", () => {

    assert.throws(
        () => require("urnadb-js-sdk"),
        {
            code: "ERR_PACKAGE_PATH_NOT_EXPORTED"
        }
    );

});
