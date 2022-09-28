const handlers = {};

export function subscribe(route, depends_on, obj) {
    const name = route + "-" + depends_on;
    if (!handlers[name]) handlers[name] = [];
    handlers[name].push(obj);
}

export function trigger(model, depends_on, value, schema) {
    const name = model + "-" + depends_on;
    let has_trigger;
    if (handlers[name]) {
        for(let obj of handlers[name]) {
            if (obj.depends_val == value) {
                schema[obj.name] = obj.fn();
                has_trigger = true;
            }
        }
    }
    return has_trigger;
}

export function buildStateListener(name, value, fn) {
    return {
        depends_val : value,
        name : name,
        fn : fn
    }
}