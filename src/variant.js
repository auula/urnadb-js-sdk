export class Variant {

    #variant;

    constructor(value = null) {
        if (value && typeof value === "object" && "variant" in value) {
            this.#variant = value.variant;
        } else {
            this.#variant = value;
        }
    }

    incr(delta = 0) {
        // 向服务器发送类似于 redis 的 incr 请求
        this.#variant += delta;
        return this.#variant;
    }

    build() {
        return this.#variant;
    }

}
