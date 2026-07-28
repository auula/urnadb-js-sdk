export default class Document {
    constructor(name: string, record?: Document<string, any>);

    readonly document: Document<string, any>;

    put(doc: any): number;
    has(key: string): boolean;
    // query 设计成条件查询
    query(key: string): any;
    search(key: string): any;
    build(): Document<string, any>;
}