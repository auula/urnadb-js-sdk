import test from "node:test";
import assert from "node:assert/strict";

import { Variant } from "urnadb-js-sdk";


test("should create variant with static factory", () => {
    const str = Variant.of("name", "string");

    assert.equal(str.name, "name");
    assert.equal(str.build(), "string");
});


test("should handle number variant", () => {
    const num = Variant.of("num", 1024);

    assert.equal(num.name, "num");
    assert.equal(num.build(), 1024);

    assert.equal(num.incr(1024), 1024 << 1);
    assert.equal(num.incr(-1024), 2048 >> 1);
});


test("should handle boolean variant", () => {
    const bool = new Variant("bool", true);

    assert.equal(bool.name, "bool");
    assert.equal(bool.build(), true);
});


test("should handle object variant", () => {
    const obj = new Variant("user", {
        full_name: "Leon Ding",
        email: "ding_ms@outlook.com",
        age: 26,
    });

    assert.equal(obj.name, "user");
    assert.deepStrictEqual(
        obj.build(),
        {
            full_name: "Leon Ding",
            email: "ding_ms@outlook.com",
            age: 26,
        }
    );
});


test("should handle variant with variant property", () => {
    const variant = new Variant("test", {
        variant: "inner value"
    });

    assert.equal(variant.build(), "inner value");
});


test("should handle null value", () => {
    const variant = new Variant("empty", null);

    assert.equal(variant.name, "empty");
    assert.equal(variant.build(), null);
});
