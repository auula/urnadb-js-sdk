import { ServerOptions } from "../src/options.js";

export const OperationType: Readonly<{
    INSERT: "INSERT";
    UPDATE: "UPDATE";
    REMOVE: "REMOVE";
}>;

interface MapBuilder {
    put(key: string, build: (builder: MapBuilder) => void): this;
    put(key: string, value: unknown): this;
    build(): Record<string, unknown>;
}

interface WhereBuilder {
    eq(column: string, value: unknown): this;
    build(): Record<string, unknown>;
}

interface Transaction {
    serializable(enabled?: boolean): this;
    put(table: string, build: (rows: TableRowsBuilder) => void): this;
    delete(table: string, build: (builder: WhereBuilder) => void): this;
    patch(table: string, build: (patcher: TableRowsPatcher) => void): this;
}

export class TableRowsBuilder {
    set(column: string, build: (builder: MapBuilder) => void): this;
    set(column: string, value: unknown): this;
    build(): Record<string, unknown>;
}

export interface TablePatcher {
    where: Record<string, unknown>;
    sets: Record<string, unknown>;
}

export class TableRowsPatcher {
    where(build: (builder: WhereBuilder) => void): this;
    sets(build: (builder: MapBuilder) => void): this;
    build(): TablePatcher;
}

export class Table {
    constructor(name: string, options: ServerOptions);

    readonly name: string;
    readonly options: ServerOptions;

    put(build: (rows: TableRowsBuilder) => void): Promise<any>;
    query(build: (builder: WhereBuilder) => void): Promise<any>;
    delete(build: (builder: WhereBuilder) => void): Promise<any>;
    patch(build: (patcher: TableRowsPatcher) => void): Promise<any>;
    transaction(build: (transaction: Transaction) => void): Promise<any>;
}
