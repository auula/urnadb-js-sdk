import { Claim } from "../src/claim.js";
import { Document } from "../src/document.js";
import { Variant } from "../src/variant.js";
import { Table } from "./table.js";

export interface ServerOptionsInit {
    host?: string;
    port?: number;
    token?: string;
    protocol?: "http" | "https";
}

export class ServerOptions {
    constructor(options?: ServerOptionsInit);

    readonly host: string;
    readonly port: number;
    readonly token: string;
    readonly protocol: string;

    baseUrl(): string;

    static builder(): ServerOptionsBuilder;
}


export class ServerOptionsBuilder {
    host(value: string): this;
    port(value: number): this;
    token(value: string): this;
    protocol(value: string): this;
    build(): ServerOptions;
}


export class UrnaDB {
    constructor(host: string, port: number, token: string, protocol?: string);

    readonly host: string;
    readonly port: number;
    readonly token: string;
    readonly options: ServerOptions;

    static OpenConnection(options?: ServerOptions | ServerOptionsInit): UrnaDB;

    // createTable(name: string, ttl?: number | null): string;
    createTable(name: string): Promise<any>;
    claims(name: string): Claim;
    tables(name: string): Table;
    variants(name: string): Variant;
    documents(name: string): Document;
    save(...items: Array<Variant | Document>): Promise<any>;
}

export default UrnaDB;
