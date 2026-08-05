import { getBinding } from "./bindings.js";

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

    // 静态工厂：纯本地构建，用于 db.save() 批量提交
    static of(name, value) {
        return new Variant(name, value);
    }

    async incr(delta = 0) {
        const options = getBinding(this);

        if (!options) {
            throw new Error("Cannot incr without server options");
        }

        const response = await fetch(
            `${options.baseUrl()}/variants/${this.#name}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": options.token
                },
                body: JSON.stringify({
                    delta: delta,
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to incr variant ${this.#name}: ${result.message || response.statusText}`
            );
        }

        this.#variant = result.data.variant;

        return this.#variant;
    }

    get name() {
        return this.#name;
    }

    build() {
        return this.#variant;
    }

}
