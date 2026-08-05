export class Variant<T = string | boolean | number | object> {
    constructor(name: string, value?: T | null);

    readonly name: string;

    // 静态工厂方法
    static of<T>(name: string, value: T): Variant<T>;

    // 服务端操作
    incr(delta?: number): Promise<number>;

    // 本地操作
    build(): T | null;
}
