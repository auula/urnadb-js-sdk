import test from "node:test";
import assert from "node:assert/strict";
import UrnaDB, { Document, Variant } from "urnadb-js-sdk";


const db = UrnaDB.OpenConnection({
    host: "192.168.3.20",
    port: 2668,
    token: "connection-secret-token",
});


test("should save a single document", async () => {
    const doc = Document.from("user.profile", {
        name: "Leon Ding",
        age: 26,
        email: "ding_ms@outlook.com"
    });

    const results = await db.save(doc);
    assert.ok(Array.isArray(results));
    assert.equal(results.length, 1);
    assert.equal(results[0].status, "success");

});


test("should save a single variant", async () => {
    const counter = Variant.of("visit.count", 0);

    const results = await db.save(counter);
    assert.ok(Array.isArray(results));
    assert.equal(results.length, 1);
    assert.equal(results[0].status, "success");

});


test("should save multiple documents and variants", async () => {
    const doc1 = Document.from("user.config", {
        theme: "dark",
        language: "zh-CN"
    });

    const doc2 = Document.from("user.settings", {
        notifications: true,
        autoSave: false
    });

    const counter = Variant.of("page.views", 100);

    const results = await db.save(doc1, doc2, counter);
    assert.ok(Array.isArray(results));
    assert.equal(results.length, 3);

    results.forEach(result => {
        assert.equal(result.status, "success");
    });

});

test("should fetch a single document", async () => {

    const userinfo = await db.documents("user.profile");

    assert.ok(userinfo instanceof Document);

    assert.equal(userinfo.name, "user.profile");

    assert.equal(typeof userinfo.document, "object");

});


test("should query document column", async () => {

    const info = await db.documents("user.profile");

    const result = await info.query("email");

    assert.equal(result.data[0], "ding_ms@outlook.com");

});



test("should fetch a single variant", async () => {

    const view = await db.variants("page.views");

    assert.ok(view instanceof Variant);

    assert.equal(view.name, "page.views");

    assert.equal(typeof view.build(), "number");

});

test("should incr a variant", async () => {

    const view = await db.variants("page.views");

    assert.ok(view instanceof Variant);

    assert.equal(view.name, "page.views");

    assert.equal(await view.incr(5), 105);

});


test("should throw error for unsupported type", async () => {

    const invalid = { name: "invalid" };

    await assert.rejects(
        async () => await db.save(invalid),
        {
            message: `Unsupported type: ${invalid.constructor.name}`
        }
    );
});