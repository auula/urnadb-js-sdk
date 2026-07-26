export class Variant<T = string | boolean | number | object> {
    constructor(variant?: T | null);

    readonly variant: T | null;

    incr(delta: number): number;
    build(): T | null;
}
