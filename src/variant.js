export class Variant {

    #name;
    #variant;
    #options;  // ServerOptions | null，null 表示纯本地对象

    constructor(name, value = null, options = null) {
        this.#name = name;
        this.#options = options;
        if (value && typeof value === "object" && "variant" in value) {
            this.#variant = value.variant;
        } else {
            this.#variant = value;
        }
    }

    // 静态工厂：纯本地构建，用于 db.save() 批量提交
    static of(name, value) {
        return new Variant(name, value);
    }

    incr(delta = 0) {
        // 向服务器发送类似于 redis 的 incr 请求
        this.#variant = (this.#variant ?? 0) + delta;
        return this.#variant;
    }

    get name() {
        return this.#name;
    }

    build() {
        return this.#variant;
    }

}
