export {
    Table,
    TableRowsBuilder
};

class Table {

    #name;
    #baseUrl;

    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
    }

    put(callback) {
        // 构造表格数据载体
        const rows = new TableRowsBuilder();

        // 执行用户 DSL
        callback(rows);

        // 获取 JSON 数据
        const json = rows.build();

        // 这里直接发送 http 请求到 DB Server 上


        console.log(JSON.stringify(json, null, 4))

        return 1;
    }
}

class MapBuilder {

    #column = {};

    put(key, value) {
        this.#column[key] = value;
        return this;
    }


    build() {
        return this.#column;
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
