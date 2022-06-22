import { Field } from "./field.js"

export class Number extends Field {
    constructor(name, obj) {
        super(name);
        this._round = 0;

        if (obj) this.apply(obj);
    }


    getChange1(store) {
        if (store.change == null) store.change = store.value;
        if (!store.change) return "";
        return store.change.min;
    }


    setChange1(store, val) {
        if (!store.change) store.change = { min: null, max: null }
        store.change.min = this.clean(val);
        store.error = this.validate(val);
    }

   
    getChange2(store) {
        if (store.change == null) store.change = store.value;
        if (!store.change) return "";
        return store.change.max;
    }


    setChange2(store, val) {
        if (!store.change) store.change = { min: null, max: null }
        store.change.max = this.clean(val);
        store.error = this.validate(val);
    }

    get round() {
        return this._round;
    }

    set round(round) {
        this._round = round;
    }
}