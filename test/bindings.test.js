import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { Document, Variant } from "urnadb-js-sdk";


test("should not bind directly constructed values with public options", async () => {
    const db = UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "connection-secret-token"
    });

    const variant = new Variant("page.views", 100, db.options);
    const document = new Document("user.profile", {}, db.options);

    await assert.rejects(variant.incr(5), {
        message: "Cannot incr without server options"
    });
    await assert.rejects(document.query("email"), {
        message: "Cannot query without server options"
    });
});


test("should bind values returned by the client", async t => {
    const original = globalThis.fetch;

    t.after(() => {
        globalThis.fetch = original;
    });

    globalThis.fetch = async (url, options = {}) => {
        const method = options.method || "GET";

        if (url.endsWith("/variants/page.views") && method === "GET") {
            return response({ data: { variant: 100 } });
        }

        if (url.endsWith("/variants/page.views") && method === "POST") {
            return response({ data: { variant: 105 } });
        }

        if (url.endsWith("/records/user.profile") && method === "GET") {
            return response({ data: { email: "ding_ms@outlook.com" } });
        }

        if (url.endsWith("/records/user.profile") && method === "POST") {
            return response({ data: ["ding_ms@outlook.com"] });
        }

        throw new Error(`Unexpected request: ${method} ${url}`);
    };

    const db = UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "connection-secret-token"
    });

    const variant = await db.variants("page.views");
    const document = await db.documents("user.profile");

    assert.equal(await variant.incr(5), 105);
    assert.deepStrictEqual(
        await document.query("email"),
        { data: ["ding_ms@outlook.com"] }
    );
});


function response(body) {
    return {
        ok: true,
        statusText: "OK",
        async json() {
            return body;
        }
    };
}
