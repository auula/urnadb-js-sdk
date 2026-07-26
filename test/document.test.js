import test from "node:test";
import assert from "node:assert/strict";

import { Document } from "urnadb-js-sdk";


test("should create document", () => {

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


    const document = new Document(user);


    // 验证 build 返回完整数据
    assert.deepStrictEqual(document.build(), user);

    // 验证是否存在字段
    assert.equal(document.has("address.zipcode"), true);

});


test("should search document", () => {

    const document = new Document({
        name: "Leon Ding",
        age: 26,
        email: "ding_ms@outlook.com",
        address: {
            nation: "China",
            city: "Shanghai",
            zipcode: 200001
        }
    });


    assert.equal(document.search("address.city"), "Shanghai");

});