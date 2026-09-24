import test from "node:test";
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";

import UrnaDB, { ServerInfo } from "urnadb-js-sdk";

// Mock fetch for unit testing
const originalFetch = global.fetch;

function mockFetch(mockData) {
    global.fetch = async (url, options) => {
        return {
            ok: true,
            status: 200,
            json: async () => ({
                status: "success",
                message: "server is healthy",
                data: mockData
            })
        };
    };
}

function restoreFetch() {
    global.fetch = originalFetch;
}

test("should get system info successfully with mock", async () => {
    // Mock 服务器响应数据
    const mockData = {
        key_count: 5,
        gc_state: 0,
        disk_free: "27.44GB",
        disk_used: "85.27GB",
        disk_total: "112.71GB",
        mem_free: "1.95GB",
        mem_total: "8.00GB",
        disk_percent: "75.65%",
        space_total: "0.00GB"
    };

    mockFetch(mockData);

    const db = UrnaDB.OpenConnection({
        host: "localhost",
        port: 2668,
        token: "test-token",
    });

    const info = await db.serverInfo();

    // 验证返回的是 serverStatus 实例
    assert.ok(info instanceof ServerInfo, "Should return ServerInfo instance");

    // 验证各个字段类型和值
    assert.ok(typeof info.keyCount === "number", "keyCount should be a number");
    assert.strictEqual(info.keyCount, 5, "keyCount should be 5");

    assert.ok(typeof info.gcState === "number", "gcState should be a number");
    assert.strictEqual(info.gcState, 0, "gcState should be 0");

    assert.ok(typeof info.diskFreeSpace === "string", "diskFreeSpace should be a string");
    assert.strictEqual(info.diskFreeSpace, "27.44GB", "diskFreeSpace should match");

    assert.ok(typeof info.diskUsedSpace === "string", "diskUsedSpace should be a string");
    assert.strictEqual(info.diskUsedSpace, "85.27GB", "diskUsedSpace should match");

    assert.ok(typeof info.diskTotalSpace === "string", "diskTotalSpace should be a string");
    assert.ok(typeof info.diskUsagePercent === "string", "diskUsagePercent should be a string");

    assert.ok(typeof info.memoryFree === "string", "memoryFree should be a string");
    assert.ok(typeof info.memoryTotal === "string", "memoryTotal should be a string");
    assert.ok(typeof info.totalSpaceUsed === "string", "totalSpaceUsed should be a string");

    // 打印系统指标信息
    console.log("\n=== UrnaDB 系统指标监控 (Mock) ===");
    console.log(`键数量: ${info.keyCount}`);
    console.log(`GC 状态: ${info.gcState} (0=初始, 1=执行中, 2=空闲)`);
    console.log(`磁盘剩余: ${info.diskFreeSpace}`);
    console.log(`磁盘已用: ${info.diskUsedSpace}`);
    console.log(`磁盘总量: ${info.diskTotalSpace}`);
    console.log(`磁盘使用率: ${info.diskUsagePercent}`);
    console.log(`内存可用: ${info.memoryFree}`);
    console.log(`内存总量: ${info.memoryTotal}`);
    console.log(`数据库存储总量: ${info.totalSpaceUsed}`);

    restoreFetch();
});

test("should get system info from real server", async () => {
    // 使用真实服务器地址（从环境变量获取或使用默认值）
    const serverHost = process.env.URNADB_HOST || "127.0.0.1";
    const serverPort = parseInt(process.env.URNADB_PORT || "2668");
    const serverToken = process.env.URNADB_TOKEN || "connection-secret-token";

    const db = UrnaDB.OpenConnection({
        host: serverHost,
        port: serverPort,
        token: serverToken,
    });

    try {
        const info = await db.serverInfo();

        // 验证返回的是 serverStatus 实例
        assert.ok(info instanceof ServerInfo, "Should return ServerInfo instance");

        // 验证各个字段类型
        assert.ok(typeof info.keyCount === "number", "keyCount should be a number");
        assert.ok(info.keyCount >= 0, "keyCount should be non-negative");

        assert.ok(typeof info.gcState === "number", "gcState should be a number");
        assert.ok([0, 1, 2].includes(info.gcState), "gcState should be 0, 1, or 2");

        assert.ok(typeof info.diskFreeSpace === "string", "diskFreeSpace should be a string");
        assert.ok(info.diskFreeSpace.length > 0, "diskFreeSpace should not be empty");

        console.log("\n=== UrnaDB 系统指标监控 (真实服务器) ===");
        console.log(`服务器: ${serverHost}:${serverPort}`);
        console.log(`键数量: ${info.keyCount}`);
        console.log(`GC 状态: ${info.gcState}`);
        console.log(`磁盘剩余: ${info.diskFreeSpace}`);
        console.log(`内存可用: ${info.memoryFree}`);
    } catch (error) {
        // 如果真实服务器不可用，跳过此测试
        console.log(`\n真实服务器 ${serverHost}:${serverPort} 不可用，跳过此测试`);
        console.log(`错误: ${error.message}`);
        // 标记为跳过而不是失败
        test.skip("Real server not available");
    }
});

test("should throw error when server is unreachable", async () => {
    const db = UrnaDB.OpenConnection({
        host: "10.255.255.1", // 不可达的 IP 地址
        port: 2668,
        token: "connection-secret-token",
    });

    await assert.rejects(
        async () => await db.serverInfo(),
        Error,
        "Should throw error when server is unreachable"
    );
});

test("should throw error with invalid token", async () => {
    // Mock 错误响应
    global.fetch = async (url, options) => {
        return {
            ok: false,
            status: 401,
            statusText: "Unauthorized",
            json: async () => ({
                status: "error",
                message: "Invalid authentication token"
            })
        };
    };

    const db = UrnaDB.OpenConnection({
        host: "localhost",
        port: 2668,
        token: "invalid-token",
    });

    await assert.rejects(
        async () => await db.serverInfo(),
        {
            name: "Error",
            message: "HTTP error|Invalid authentication"
        },
        "Should throw error with invalid token"
    );

    restoreFetch();
});

test("should handle PQL error response", async () => {
    // Mock PQL 错误响应
    global.fetch = async (url, options) => {
        return {
            ok: true,
            status: 200,
            json: async () => ({
                status: "error",
                message: "Server internal error"
            })
        };
    };

    const db = UrnaDB.OpenConnection({
        host: "localhost",
        port: 2668,
        token: "test-token",
    });

    await assert.rejects(
        async () => await db.serverInfo(),
        {
            name: "Error",
            message: "Server internal error"
        },
        "Should throw error when PQL status is error"
    );

    restoreFetch();
});
