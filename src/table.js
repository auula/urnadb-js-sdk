export {
    Table,
    TableRowsBuilder
};

class Table {

    #name;

    constructor(name) {
        this.name = name;
    }

    put(callback) {
        // 构造表格数据载体
        const rows =
            new TableRowsBuilder();

        // 执行用户 DSL
        callback(rows);

        // 获取 JSON 数据
        const json =
            rows.build();

    }
}

class TableRowsBuilder {

}
