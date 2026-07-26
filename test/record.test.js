import test from "node:test";
import assert from "node:assert/strict";

import { Record } from "urnadb-js-sdk";


test("should create record", () => {

    const user = {
        name: "Leon Ding",
        age: 26,
        email: "ding_ms@outlook.com",
        address: {
            nation: "China",
            city: "Shanghai",
            zipcode: 200001
        }
    };


    const record = new Record(user);


    // 验证 build 返回完整数据
    assert.deepStrictEqual(record.build(), user);

    // 验证是否存在字段
    assert.equal(record.has("address.zipcode"), true);

});


test("should search record", () => {

    const record = new Record({
        name: "Leon Ding",
        age: 26,
        email: "ding_ms@outlook.com",
        address: {
            nation: "China",
            city: "Shanghai",
            zipcode: 200001
        }
    });


    assert.equal(record.search("address.city"), "Shanghai");

});