import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB from "urnadb-js-sdk";


const db = UrnaDB.OpenConnection({
    host: "192.168.3.20",
    port: 2668,
    token: "connection-secret-token",
});


test("should create table", async () => {

    const result = await db.createTable("users");

    assert.equal(result.status, "success");
});


test("should insert row data into table", async () => {

    const result = await db.tables("users").put(rows => {
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

    assert.equal(result.status, "success");

});


test("should update table row data", async () => {

    const result = await db.tables("users").patch(patch => {
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

    assert.equal(result.status, "success");

});


test("should delete table row data", () => {

    const id = db.tables("users").delete(where => {
        where.eq("name", "Leon Ding");
    });

    assert.equal(id, 1);

});


test("should query table row data", () => {

    const id = db.tables("users").query(where => {
        where.eq("id", 1);
    });

    assert.equal(id, 1);

});


test("should build a transaction with multiple table", () => {

    const db = UrnaDB.OpenConnection({
        host: "test.db.example.com",
        port: 2668,
        token: "connection-secret-token"
    });

    // UrnaDB ES6 SDK Transaction Example:
    const rows = db.tables().transaction(txns => {
        txns
            // Enable serializable isolation level for this transaction
            .serializable(true)
            .put("users", rows => {
                rows
                    .set("name", "Leon Ding")
                    .set("age", 26)
                    .set("address", address => {
                        address
                            .put("🌍 nation", "China")
                            .put("🌆 city", "Shanghai")
                            .put("📧 zipcode", 200001);
                    })
                    .set("hobbies", ["🏸️ badminton", "🎮 games", "🎵 music"]);
            })
            .patch("users", patch => {
                patch
                    .where(where => {
                        where.eq("id", 1);
                    })
                    .sets(sets => {
                        sets
                            .put("name", "Leon Ding")
                            .put("address", address => {
                                address
                                    .put("🌆 city", "Singapore");
                            })
                    });
            });
    });

    assert.equal(rows, 2);

});
