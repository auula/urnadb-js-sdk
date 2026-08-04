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

    // 合并对象
    merge(data) {
        this.#document = { ...this.#document, ...data };
        return this;
    }

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
    async query(target) {

        if (!this.#options) {
            throw new Error("Cannot query without server options");
        }

        const response = await fetch(
            `${this.#options.baseUrl()}/records/${this.#name}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": this.#options.token
                },
                body: JSON.stringify({
                    column: target,
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to query document field ${this.#name}: ${result.message || response.statusText}`
            );
        }

        return result;
    }

    build() {
        return this.#document;
    }

}
