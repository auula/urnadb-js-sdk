import { Claim } from "../src/claim.js";
import { Document } from "../src/document.js";
import { Variant } from "../src/variant.js";
import { Table } from "./table.js";

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
    claim(name: string): Claim;
    table(name: string): Table;
    variant(name: string): Variant;
    document(name: string): Document;
    save(...items: Array<Variant | Document>): Promise<any>;
}

export default UrnaDB;
