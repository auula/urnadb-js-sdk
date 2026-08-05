export { Table };

const OperationType = Object.freeze({
    INSERT: "INSERT",
    UPDATE: "UPDATE",
    REMOVE: "REMOVE",
});

class Table {

    #name;
    #options;


    constructor(name, options) {
        this.#name = name;
        this.#options = options;
    }

    get name() {
        return this.#name;
    }

    get options() {
        return this.#options;
    }


    async put(callback) {

        const rows = new TableRowsBuilder();

        callback(rows);

        const response = await fetch(
            `${this.options.baseUrl()}/tables/${this.#name}/rows`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    rows: rows.build()
                })
            }
        );


        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to put rows into table ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }


    async patch(callback) {

        const patcher = new TableRowsPatcher();

        callback(patcher);

        const json = patcher.build();

        const response = await fetch(
            `${this.options.baseUrl()}/tables/${this.#name}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    wheres: json.where,
                    sets: json.sets
                })
            }
        );


        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to patch rows table ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }

    async delete(callback) {

        const builder = new WhereBuilder();

        callback(builder);

        const response = await fetch(
            `${this.options.baseUrl()}/tables/${this.#name}/rows`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    wheres: builder.build()
                })
            }
        );


        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to delete table ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }

    async query(callback) {

        const builder = new WhereBuilder();

        callback(builder);

        const response = await fetch(
            `${this.options.baseUrl()}/tables/${this.#name}/query`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    wheres: builder.build()
                })
            }
        );


        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to query table ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }


    async transaction(callback) {

        const txns = new Transaction();

        callback(txns);

        const response = await fetch(
            `${this.options.baseUrl()}/txns`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    mutations: txns.mutations.map(mutation => ({
                        name: mutation.name,
                        operation: mutation.operation,
                        where: mutation.conditions,
                        values: mutation.data
                    })),
                    serializable: txns.isolation
                })
            }
        );


        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to execute transaction on table ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }
}

class Transaction {

    #mutations = [];
    #isolation = false;

    constructor() {
        this.#mutations = [];
    }

    serializable(enabled = false) {
        this.#isolation = enabled;
        return this;
    }

    patch(name, callback) {

        const patcher = new TableRowsPatcher();

        callback(patcher);

        this.mutations.push(new TableMutation({
            name,
            operation: OperationType.UPDATE,
            conditions: patcher.build().where,
            data: patcher.build().sets
        }));

        return this;
    }

    put(name, callback) {

        const builder = new TableRowsBuilder();

        callback(builder);

        this.mutations.push(new TableMutation({
            name,
            operation: OperationType.INSERT,
            data: builder.build()
        }));

        return this;
    }

    delete(name, callback) {

        const builder = new WhereBuilder();

        callback(builder);

        this.mutations.push(new TableMutation({
            name,
            operation: OperationType.REMOVE,
            conditions: builder.build(),
        }));

        return this;
    }

    get mutations() {
        return this.#mutations;
    }

    get isolation() {
        return this.#isolation;
    }

}

class TableMutation {

    #name;
    #operation;
    #conditions;
    #data;

    constructor({
        name = "",
        operation = null,
        conditions = {},
        data = {},
    } = {}) {

        this.#name = name;
        this.#operation = operation;
        this.#conditions = conditions;
        this.#data = data;
    }


    get name() {
        return this.#name;
    }


    get operation() {
        return this.#operation;
    }


    get conditions() {
        return this.#conditions;
    }


    get data() {
        return this.#data;
    }
}


class TableRowsBuilder {

    #rows = {};


    set(column, value) {

        if (typeof value === "function") {

            const builder = new MapBuilder();

            value(builder);

            this.#rows[column] = builder.build();

        } else {

            this.#rows[column] = value;

        }

        return this;
    }


    build() {
        return this.#rows;
    }
}


class MapBuilder {

    #column = {};


    put(key, value) {

        if (typeof value === "function") {

            const builder = new MapBuilder();

            value(builder);

            this.#column[key] = builder.build();

        } else {

            this.#column[key] = value;

        }

        return this;
    }


    build() {
        return this.#column;
    }
}


class WhereBuilder {

    #where = {};


    eq(column, value) {

        this.#where[column] = value;

        return this;
    }


    build() {
        return this.#where;
    }
}


class TableRowsPatcher {

    #where = {};
    #rows = {};


    where(callback) {

        const builder = new WhereBuilder();

        callback(builder);

        this.#where = builder.build();

        return this;
    }


    sets(callback) {

        const builder = new MapBuilder();

        callback(builder);

        this.#rows = builder.build();

        return this;
    }


    build() {

        return {
            where: this.#where,
            sets: this.#rows
        };

    }

}
