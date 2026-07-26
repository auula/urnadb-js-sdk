export default class Record {
    constructor(record?: Record<string, any>);

    readonly record: Record<string, any>;

    has(key: string): boolean;
    query(key: string): any;
    search(key: string): any;
    build(): Record<string, any>;
}