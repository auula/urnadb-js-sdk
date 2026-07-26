import test from "node:test";
import assert from "node:assert/strict";

import { Variant } from "urnadb-js-sdk";


test("should type variant", () => {

    const str = new Variant("test string");

    assert.equal(str.build(), "test string");


    const num = new Variant(1024);

    assert.equal(num.build(), 1024);


    const bool = new Variant(true);

    assert.equal(bool.build(), true);


    const expected = {
        name: "Leon Ding",
        email: "ding_ms@outlook.com",
        age: 26,
    };

    
    const obj = new Variant(expected);


    assert.deepStrictEqual(
        obj.build(),
        expected
    );

});
