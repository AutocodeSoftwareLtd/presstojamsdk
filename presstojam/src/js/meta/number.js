import { Field } from "./field.js"

export class Number extends Field {
    constructor(name, obj) {
        super(name);
        this._round = 0;

        if (obj) this.apply(obj);
    }

    clean(val) {
        if (this._round) return parseFloat(val);
        else return parseInt(val);
    }

    getVal(store) {
        let val = (store.value) ? store.value : 0;
        return val.toFixed(this._round);
    }

    setVal(store, val) {
        store.value = this.clean(val);
        store.error = this.validate(val);
    }

    getChange(store) {
        if (store.change == null) store.change=  store.value;
        if (!store.change) return "";
        return store.change.toFixed(this._round);
    }

    setChange(store, val) {
        store.change = this.clean(val);
        store.error = this.validate(val);
        this.trigger(val);
    }

    getFilter(store) {
        let val = (store.value) ? store.value : 0;
        return store.value.toFixed(this._round);
    }
    
    setFilter(store, val) {
        store.value = this.clean(val);
    }


    getChange1(store) {
        if (store.change == null) store.change = store.value;
        if (!store.change) return "";
        return store.change.toFixed(this._round);
    }


    setChange1(store, val) {
        if (store.change2 != null && val > store.change2) {
            throw "Trying to set min number larger than max";
        } 
        if (!store.change) store.change = store.value;
       
        store.change = this.clean(val);
        store.error = this.validate(val);
    }

   
    getChange2(store) {
        if (store.change2 == null) store.change2 = store.value;
        if (!store.change2) return "";
        return store.change2.toFixed(this._round);
    }


    setChange2(store, val) {
        if (store.change != null && val < store.change2) {
            throw "Trying to set max number larger than min";
        }
        store.change2 = this.clean(val);
        store.error = this.validate(val);
    }

    get round() {
        return this._round;
    }

    set round(round) {
        this._round = round;
    }
}