import test from "node:test";
import assert from "node:assert/strict";

import { Document } from "urnadb-js-sdk";


test("should create document with static factory", () => {
    const document = Document.from("userinfo", {
        name: "Leon Ding",
        age: 26
    });

    assert.equal(document.name, "userinfo");
    assert.deepStrictEqual(document.build(), {
        name: "Leon Ding",
        age: 26
    });
});


test("should merge data", () => {
    const document = Document.from("user", {
        name: "Leon",
        age: 25
    });

    document.merge({
        age: 26,
        email: "test@example.com"
    });

    const built = document.build();
    assert.equal(built.name, "Leon");
    assert.equal(built.age, 26);
    assert.equal(built.email, "test@example.com");
});


test("should check if field exists", () => {
    const document = Document.from("userinfo", {
        name: "Leon Ding",
        age: 26,
        address: {
            city: "Shanghai",
            zipcode: 200001
        }
    });

    assert.equal(document.has("name"), true);
    assert.equal(document.has("age"), true);
    assert.equal(document.has("address.city"), true);
    assert.equal(document.has("address.zipcode"), true);
    assert.equal(document.has("address.country"), false);
    assert.equal(document.has("phone"), false);
});


test("should search field value", () => {
    const document = Document.from("userinfo", {
        name: "Leon Ding",
        age: 26,
        address: {
            city: "Shanghai",
            zipcode: 200001
        }
    });

    assert.equal(document.search("name"), "Leon Ding");
    assert.equal(document.search("age"), 26);
    assert.equal(document.search("address.city"), "Shanghai");
    assert.equal(document.search("address.zipcode"), 200001);
    assert.equal(document.search("nonexistent"), undefined);
});