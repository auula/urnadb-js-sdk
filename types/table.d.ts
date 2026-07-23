interface MapBuilder {
    put(key: string, build: (builder: MapBuilder) => void): this;
    put(key: string, value: unknown): this;
    build(): Record<string, unknown>;
}

interface WhereBuilder {
    eq(column: string, value: unknown): this;
    build(): Record<string, unknown>;
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
    constructor(name: string, baseUrl: string);

    put(build: (rows: TableRowsBuilder) => void): number;
    patch(build: (patcher: TableRowsPatcher) => void): number;
}
