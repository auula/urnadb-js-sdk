export class Document {

    #name;
    #document;
    #options;  // ServerOptions | null

    constructor(name, document = {}, options = null) {
        this.#name = name;
        this.#document = document;
        this.#options = options;
    }

    // 静态工厂：纯本地构建，用于 db.save() 批量提交
    static from(name, document = {}) {
        return new Document(name, document, null);
    }

    get name() {
        return this.#name;
    }

    get document() {
        return this.#document;
    }

    // ========== 本地操作方法 ==========

    // 合并对象
    merge(data) {
        this.#document = { ...this.#document, ...data };
        return this;
    }

    // ========== 查询方法 ==========
    has(key) {
        const keys = key.split(".");

        let current = this.#document;

        for (const k of keys) {
            if (
                current === null ||
                typeof current !== "object" ||
                !Object.hasOwn(current, k)
            ) {
                return false;
            }

            current = current[k];
        }

        return true;
    }

    search(key) {

        const keys = key.split(".");

        let current = this.#document;


        for (const k of keys) {
            if (
                current === null ||
                typeof current !== "object" ||
                !Object.hasOwn(current, k)
            ) {
                return undefined;
            }

            current = current[k];
        }


        return current;
    }

    // 从服务器查询文档
    async query(key) {
        if (!this.#options) {
            throw new Error("Cannot query without server options");
        }

        // TODO: 发送 HTTP 请求到服务器
        // GET /document/{name}?key={key}
        const response = await fetch(
            `${this.#options.baseUrl()}/document/${this.#name}?key=${key}`,
            {
                headers: {
                    "Authorization": `Bearer ${this.#options.token}`
                }
            }
        );

        const data = await response.json();
        this.#document = data;
        return this.#document;
    }

    build() {
        return this.#document;
    }

}
