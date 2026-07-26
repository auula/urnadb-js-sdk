export class Record {

    #record;

    constructor(record = {}) {
        this.#record = record;
    }


    get record() {
        return this.#record;
    }


    has(key) {
        const keys = key.split(".");

        let current = this.#record;

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

        let current = this.#record;


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
        return this.#record;
    }

}