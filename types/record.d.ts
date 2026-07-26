export default class Record {

    constructor(record?: Record<string, any>);

    readonly record: Record<string, any>;

    get(key: string): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    query(key:string):any;
    search(key:string):any;
    build(): Record<string, any>;
}