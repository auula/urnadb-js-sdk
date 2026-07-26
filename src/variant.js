export class Variant {

    #variant;

    constructor(value = null) {
        if (value && typeof value === "object" && "variant" in value) {
            this.#variant = value.variant;
        } else {
            this.#variant = value;
        }
    }


    get variant() {
        return this.#variant;
    }

    build() {
        return this.#variant;
    }

}
