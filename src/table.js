export {
    Table,
    TableRowsBuilder
};

export class Table {

    #name;
    #baseUrl;


    constructor(name, baseUrl) {
        this.#name = name;
        this.#baseUrl = baseUrl;
    }


    put(callback) {

        const rows = new TableRowsBuilder();

        callback(rows);

        const json = rows.build();

        // TODO: send HTTP request to DB Server

        console.log(JSON.stringify(json, null, 4));

        return 1;
    }


    patch(callback) {

        const patcher = new TableRowsPatcher();

        callback(patcher);

        const json = patcher.build();

        // TODO: send HTTP request to DB Server

        console.log(JSON.stringify(json, null, 4));

        return 1;
    }
}


export class TableRowsBuilder {

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


export class MapBuilder {

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


export class WhereBuilder {

    #where = {};


    eq(column, value) {

        this.#where[column] = value;

        return this;
    }


    build() {
        return this.#where;
    }
}


export class TableRowsPatcher {

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