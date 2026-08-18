export class Claim {
    constructor(name: string, ttl?: number);

    readonly name: string;

    // 上锁：PUT /locks/{name} { ttl } -> { data: { token } }
    acquire(): Promise<this>;

    // 续租：PATCH /locks/{name} { token } -> { data: { token } }
    extend(): Promise<this>;

    // 解锁：DELETE /locks/{name} { token }
    release(): Promise<boolean>;

    // 上锁 -> 执行业务 -> 释放（无论业务成功或抛异常都释放）
    using(callback: (claim: Claim) => Promise<void> | void): Promise<this>;

    static acquire(name: string, seconds?: number): Claim;
}
