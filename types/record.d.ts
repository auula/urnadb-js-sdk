export default class Record {

    constructor(record?: Record<string, any>);

    readonly record: Record<string, any>;

    get(key: string): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    build(): Record<string, any>;
}