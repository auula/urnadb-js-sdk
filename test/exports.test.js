import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";


const require = createRequire(import.meta.url);


test("root entry should support default and named imports", async () => {

    const sdk = await import("urnadb-js-sdk");

    assert.equal(sdk.default, sdk.UrnaDB);

    for (const exportName of [
        "UrnaDB",
        "ServerOptions",
        "Table",
        "TableRowsBuilder",
        "TableRowsPatcher"
    ]) {
        assert.equal(typeof sdk[exportName], "function");
    }

    const options = new sdk.ServerOptions({
        host: "127.0.0.1",
        port: 2668,
        token: "connection-secret-token"
    });

    const db = sdk.UrnaDB.OpenConnection(options);

    assert.ok(db instanceof sdk.UrnaDB);
    assert.ok(db.tables("users") instanceof sdk.Table);

});


test("table subpath should reference the root table exports", async () => {

    const [sdk, tableApi] = await Promise.all([
        import("urnadb-js-sdk"),
        import("urnadb-js-sdk/table")
    ]);

    assert.equal(tableApi.Table, sdk.Table);
    assert.equal(tableApi.TableRowsBuilder, sdk.TableRowsBuilder);
    assert.equal(tableApi.TableRowsPatcher, sdk.TableRowsPatcher);

    const rows = new tableApi.TableRowsBuilder()
        .set("name", "Leon Ding")
        .set("active", true);

    assert.deepEqual(rows.build(), {
        name: "Leon Ding",
        active: true
    });

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
