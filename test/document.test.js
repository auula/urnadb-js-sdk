import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { Document } from "urnadb-js-sdk";


test("should open connection and put document", () => {

    const db = UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "xxxxxxxxxx"
    });

    const bool = db.document("user").put({
        name: "Leon Ding",
        age: 26,
        email: "ding_ms@outlook.com",
        address: {
            nation: "China",
            city: "Shanghai",
            zipcode: 200001
        }
    });

    assert.equal(bool, true);

});


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


    const document = new Document("userinfo", user);


    // 验证 build 返回完整数据
    assert.deepStrictEqual(document.build(), user);

    // 验证是否存在字段
    assert.equal(document.has("address.zipcode"), true);

});


test("should search document", () => {

    const document = new Document("userinfo", {
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