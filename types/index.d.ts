import { Table } from "./table.js";

export {
    Table,
    TableRowsBuilder,
    TableRowsPatcher
} from "./table.js";

export interface ServerOptionsInit {
    host?: string;
    port?: number;
    token?: string;
}

export class ServerOptions {
    constructor(options?: ServerOptionsInit);

    readonly host: string;
    readonly port: number;
    readonly token: string;

    baseUrl(): string;
}

export class UrnaDB {
    constructor(host: string, port: number, token: string);

    host: string;
    port: number;
    token: string;

    static OpenConnection(options?: ServerOptions | ServerOptionsInit): UrnaDB;

    createTable(name: string, ttl?: number | null): string;
    tables(name: string): Table;
}

export default UrnaDB;
