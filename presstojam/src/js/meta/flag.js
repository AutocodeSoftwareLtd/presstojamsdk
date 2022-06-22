import { Field } from "./field.js"

export class Flag extends Field {

    constructor(name, obj) {
        super(name);
        if (obj) this.apply(obj);
    }


    clean(val) {
        return (val) ? 1 : 0;
    }


    getChange1(store) {
        if (store.change == null) store.change = store.value;
        if (store.change == null) return 0;
        else if (!store.change) return 2;
        else return store.change;
    }

    setChange1(store, val) {
        if (val == 0) {
            store.change = null;
            return;
        }
        if (val == 2) val = 0;
        store.change = this.clean(val);
        store.error = this.validate(val);
    }

}