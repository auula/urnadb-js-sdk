export class Document {

    #name;
    #document;

    constructor(name, document = {}) {
        this.#name = name;
        this.#document = document;
    }


    get document() {
        return this.#document;
    }


    put(document = {}) {
        this.#document = document;
        return true;
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