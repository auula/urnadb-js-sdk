const bindings = new WeakMap();

export function bind(instance, options) {
    bindings.set(instance, options);
}

export function getBinding(instance) {
    return bindings.get(instance);
}
