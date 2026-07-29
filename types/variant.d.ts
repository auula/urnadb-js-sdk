import { ServerOptions } from "./index.js";

export class Variant<T = string | boolean | number | object> {
    constructor(name: string, value?: T | null, options?: ServerOptions | null);

    readonly name: string;
    readonly variant: T | null;

    static of<T>(name: string, value: T): Variant<T>;

    // 服务端操作
    incr(delta?: number): Promise<number>;

    // 本地操作
    build(): T | null;
}