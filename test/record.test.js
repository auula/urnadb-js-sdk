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
    assert.deepStrictEqual(record.build(),user);


    // 验证读取字段
    assert.equal(record.get("name"),"Leon Ding");


    assert.equal(record.get("age"),26);


    // 验证嵌套对象
    assert.deepStrictEqual(
        record.get("address"),
        {
            nation: "China",
            city: "Shanghai",
            zipcode: 200001
        }
    );


    // 验证不存在字段
    assert.equal(record.get("not_exists"),undefined);

});


test("should update record", () => {

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


    record.set("age", 26);


    assert.deepStrictEqual(
        record.build(),
        {
            name: "Leon Ding",
            age: 26,
            email: "ding_ms@outlook.com",
            address: {
                nation: "China",
                city: "Shanghai",
                zipcode: 200001
            }
        }
    );

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