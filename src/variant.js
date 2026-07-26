export class Variant {

    #name;
    #variant;

    constructor(name, value = null) {
        this.#name = name;
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

    get name(){
        return this.#name;
    }

    build() {
        return this.#variant;
    }

}
