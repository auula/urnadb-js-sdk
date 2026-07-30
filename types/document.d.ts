export default class Document {
    constructor(name: string, document?: Record<string, any>, options?: any);

    readonly name: string;
    readonly document: Record<string, any>;

    // 静态工厂方法
    static from(name: string, document?: Record<string, any>): Document;

    // 本地操作方法
    merge(data: Record<string, any>): this;

    // 查询方法
    has(key: string): boolean;
    search(key: string): any;
    query(key: string): Promise<any>;

    // 构建方法
    build(): Record<string, any>;
}
