import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { Claim } from "urnadb-js-sdk";

test("should return a named claim instance when acquired", () => {

    const c1 = new Claim("orders-01", 30);

    assert.equal(c1.release(), true);

    const c2 = Claim.acquire("orders-02", 60)
        .using(
            claim => {
                // 继续保活租期
                claim.extend();
                // 模拟突然运算异常提前释放锁
                throw new Error("database error");
            }
        ).release();

    console.log(c2);

});


test("should release the claim when scoped work throws", () => {

    const db = UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "xxxxxxxxxx"
    });

    const c3 = db.claims("orders")
        .using(
            claim => {
                // 继续保活租期
                claim.extend();
                // 模拟突然运算异常提前释放锁
                throw new Error("database error");
            }
        ).release();

    console.log(c3);
});
