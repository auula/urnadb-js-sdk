import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB from "urnadb-js-sdk";


const db = UrnaDB.OpenConnection({
    host: "127.0.0.1",
    port: 2668,
    token: "xxxxxxxxxx"
});


test("should create table", () => {

    const name = db.createTable("users");

    assert.equal(name, "users");

});


test("should insert row data into table", () => {

    const id = db.tables("users").put(rows => {
        rows
            .set("name", "Leon Ding")
            .set("age", 26)
            .set("address", address => {
                address
                    .put("🌍 nation", "China")
                    .put("🌆 city", "Shanghai")
                    .put("📧 zipcode", 2000001);
            })
            .set("hobbies", ["🏸️ badminton", "🎮 games", "🎵 music"]);
    });

    assert.equal(id, 1);

});


test("should update table row data", () => {

    const id = db.tables("users").patch(patch => {
        patch
            .where(where => {
                where.eq("id", 1);
            })
            .sets(sets => {
                sets
                    .put("name", "Leon Ding")
                    .put("age", 27)
                    .put("address", address => {
                        address
                            .put("🌆 city", "New York")
                    })
            });
    });

    assert.equal(id, 1);

});


test("should delete table row data", () => {

    const id = db.tables("users").delete(where => {
        where.eq("id", 1);
    });

    assert.equal(id, 1);

});