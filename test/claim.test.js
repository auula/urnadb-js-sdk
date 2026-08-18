import test from "node:test";
import assert from "node:assert/strict";

import UrnaDB, { Claim } from "urnadb-js-sdk";

function mockFetch(handler) {
    const calls = [];
    const original = globalThis.fetch;
    globalThis.fetch = async (url, init = {}) => {
        const body = init.body ? JSON.parse(init.body) : null;
        calls.push({
            url,
            method: init.method,
            body,
            headers: init.headers || {}
        });
        return handler({ url, method: init.method, body });
    };
    return {
        calls,
        restore() {
            globalThis.fetch = original;
        }
    };
}

function ok(data, message = "ok") {
    return {
        ok: true,
        statusText: "OK",
        json: async () => ({ status: "success", message, data })
    };
}

function fail(message, statusText = "Bad Request") {
    return {
        ok: false,
        statusText,
        json: async () => ({ status: "error", message })
    };
}

function createDb() {
    return UrnaDB.OpenConnection({
        host: "127.0.0.1",
        port: 2668,
        token: "test-token"
    });
}


test("should construct a named claim with ttl", () => {
    const c = new Claim("orders-01", 30);
    assert.equal(c.name, "orders-01");
});


test("should default ttl when not provided", () => {
    const c = new Claim("orders-02");
    assert.equal(c.name, "orders-02");
});


test("static acquire should build a claim with seconds", () => {
    const c = Claim.acquire("orders-03", 60);
    assert.ok(c instanceof Claim);
    assert.equal(c.name, "orders-03");
});


test("static acquire should default seconds when omitted", () => {
    const c = Claim.acquire("orders-04");
    assert.equal(c.name, "orders-04");
});


test("db.claims should return a bound claim instance", () => {
    const db = createDb();
    const c = db.claims("orders");
    assert.ok(c instanceof Claim);
    assert.equal(c.name, "orders");
});


test("unbound claim acquire should throw", async () => {
    const c = new Claim("orders", 30);
    await assert.rejects(c.acquire(), {
        message: "Claim operations are only available through db.claims()"
    });
});


test("unbound claim extend should throw", async () => {
    const c = new Claim("orders", 30);
    await assert.rejects(c.extend(), {
        message: "Claim operations are only available through db.claims()"
    });
});


test("extend before acquire should throw", async () => {
    const db = createDb();
    const c = db.claims("orders");
    await assert.rejects(c.extend(), {
        message: "Failed to extend lock orders: lock not acquired"
    });
});


test("release on unacquired claim should return true without HTTP", async () => {
    const db = createDb();
    const c = db.claims("orders");
    const mock = mockFetch(() => fail("should not be called"));
    try {
        const released = await c.release();
        assert.equal(released, true);
        assert.equal(mock.calls.length, 0);
    } finally {
        mock.restore();
    }
});


test("should acquire lock and return this", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" }, "lock created successfully");
        return fail("unexpected method");
    });

    try {
        const returned = await claim.acquire();
        assert.equal(returned, claim);
        assert.equal(mock.calls.length, 1);
        assert.equal(mock.calls[0].method, "PUT");
        assert.equal(mock.calls[0].url, "http://127.0.0.1:2668/locks/orders");
        assert.deepEqual(mock.calls[0].body, { ttl: 30 });
        assert.equal(mock.calls[0].headers["Auth-Token"], "test-token");
        assert.equal(mock.calls[0].headers["Content-Type"], "application/json");
    } finally {
        await claim.release().catch(() => {});
        mock.restore();
    }
});


test("should extend lease with current token and rotate to new token", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" }, "lock created successfully");
        if (method === "PATCH") return ok({ token: "T2" }, "lease acquired successfully");
        if (method === "DELETE") return ok(undefined, "lock deleted successfully");
        return fail("unexpected method");
    });

    try {
        await claim.acquire();
        const returned = await claim.extend();
        assert.equal(returned, claim);

        assert.equal(mock.calls[1].method, "PATCH");
        assert.deepEqual(mock.calls[1].body, { token: "T1" });

        await claim.release();
        assert.equal(mock.calls[2].method, "DELETE");
        assert.deepEqual(mock.calls[2].body, { token: "T2" });
    } finally {
        mock.restore();
    }
});


test("acquire failure should throw and keep claim releasable", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(() => fail("already locked", "Conflict"));

    try {
        await assert.rejects(
            claim.acquire(),
            { message: "Failed to acquire lock orders: already locked" }
        );
        const released = await claim.release();
        assert.equal(released, true);
        assert.equal(mock.calls.length, 1);
    } finally {
        mock.restore();
    }
});


test("extend failure should throw", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    let callCount = 0;
    const mock = mockFetch(({ method }) => {
        callCount++;
        if (method === "PUT" && callCount === 1) return ok({ token: "T1" });
        return fail("lease expired", "Conflict");
    });

    try {
        await claim.acquire();
        await assert.rejects(
            claim.extend(),
            { message: "Failed to extend lock orders: lease expired" }
        );
    } finally {
        mock.restore();
    }
});


test("using should acquire, run callback and release on success", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" });
        if (method === "DELETE") return ok(undefined, "lock deleted successfully");
        return fail("unexpected method");
    });

    const order = [];

    try {
        const returned = await claim.using(async (c) => {
            assert.ok(c instanceof Claim);
            assert.equal(c, claim);
            order.push("callback");
        });

        assert.equal(returned, claim);
        assert.deepEqual(order, ["callback"]);
        assert.equal(mock.calls.length, 2);
        assert.equal(mock.calls[0].method, "PUT");
        assert.equal(mock.calls[1].method, "DELETE");
    } finally {
        mock.restore();
    }
});


test("using should still release when callback throws", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" });
        if (method === "DELETE") return ok(undefined, "lock deleted successfully");
        return fail("unexpected method");
    });

    try {
        await assert.rejects(
            claim.using(async () => {
                throw new Error("business error");
            }),
            { message: "business error" }
        );

        assert.equal(mock.calls.length, 2);
        assert.equal(mock.calls[0].method, "PUT");
        assert.equal(mock.calls[1].method, "DELETE");
    } finally {
        mock.restore();
    }
});


test("release should be idempotent (safe to call multiple times)", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" });
        if (method === "DELETE") return ok(undefined);
        return fail("unexpected method");
    });

    try {
        await claim.acquire();
        const r1 = await claim.release();
        assert.equal(r1, true);
        const r2 = await claim.release();
        assert.equal(r2, true);
        assert.equal(mock.calls.length, 2);
    } finally {
        mock.restore();
    }
});


test("using should throw release error when callback succeeds but release fails", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" });
        if (method === "DELETE") return fail("release failed", "Internal Server Error");
        return fail("unexpected method");
    });

    try {
        await assert.rejects(
            claim.using(async () => {}),
            { message: "Failed to release lock orders: release failed" }
        );
    } finally {
        mock.restore();
    }
});


test("using should propagate callback error even when release also fails", async () => {
    const db = createDb();
    const claim = db.claims("orders");

    const mock = mockFetch(({ method }) => {
        if (method === "PUT") return ok({ token: "T1" });
        if (method === "DELETE") return fail("release failed", "Internal Server Error");
        return fail("unexpected method");
    });

    try {
        await assert.rejects(
            claim.using(async () => {
                throw new Error("business error");
            }),
            { message: "business error" }
        );
        assert.equal(mock.calls.length, 2);
        assert.equal(mock.calls[0].method, "PUT");
        assert.equal(mock.calls[1].method, "DELETE");
    } finally {
        mock.restore();
    }
});
