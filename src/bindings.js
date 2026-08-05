const bindings = new WeakMap();

export function bind(instance, options) {
    bindings.set(instance, options);
    return instance;
}

export function getBinding(instance) {
    return bindings.get(instance);
}
