import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { Document } from "urnadb-js-sdk";


test("should keep concurrent save responses isolated", async t => {
    const original = globalThis.fetch;

    t.after(() => {
        globalThis.fetch = original;
    });

    globalThis.fetch = async url => {
        if (url.endsWith("/failed")) {
            return {
                ok: false,
                statusText: "Bad Request",
                async json() {
                    await new Promise(resolve => setTimeout(resolve, 30));
                    return {
                        status: "error",
                        message: "first request failed"
                    };
                }
            };
        }

        await new Promise(resolve => setTimeout(resolve, 5));

        return {
            ok: true,
            statusText: "OK",
            async json() {
                return {
                    status: "success",
                    message: "second request succeeded"
                };
            }
        };
    };

    const db = UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "connection-secret-token"
    });

    await assert.rejects(
        db.save(
            Document.from("failed", {}),
            Document.from("succeeded", {})
        ),
        {
            message: "Failed to save failed: first request failed"
        }
    );
});
