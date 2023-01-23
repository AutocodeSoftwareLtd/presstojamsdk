const _subscriptions = {};


export function subscribe(type, id, callback) {
    if (!_subscriptions[type]) {
        _subscriptions[type] = {};
    }
    _subscriptions[type][id] = callback;
}


export function unsubscribe(type, id) {
    if (_subscriptions[type] && _subscriptions[type][id]) {
        delete _subscriptions[type][id];
    }
}


export function trigger(type, ...args) {
    if (_subscriptions[type]) {
        for(const id in _subscriptions[type]) {
            _subscriptions[type][id](...args);
        }
    }
}


