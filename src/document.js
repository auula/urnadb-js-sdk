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

    get document() {
        return this.#document;
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


    // query 直接查询服务的
    query(key) {
        return undefined;
    }


    build() {
        return this.#document;
    }

}