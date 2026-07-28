export class Claim {
    constructor(name: string, token?: string | null);

    // 这个可以传入参数，参数表示明确可以传入续租时间
    extend(seconds?: number): this;
    release(): boolean;

    static acquire(name: string, options?: any): Claim;

    using(
        callback: (claim: Claim) => Promise<void>
    ): Promise<this>;
}