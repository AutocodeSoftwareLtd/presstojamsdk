import { Field } from "./field.js"

export class String extends Field {

    constructor(name, obj) {
        super(name);

        if (obj) this.apply(obj);
    }

    setContainsAsOptions(options) {
        let opts = [];
        for(let exp of this._contains) {
            if (exp.indexOf(":") > -1) {
                const pts = exp.split(":");
                opts.push({ key : pts[0], value : pts[1]});
            } else {
                opts.push({ key : exp, value : exp});
            }
        }
        options.value = opts;
    }


    addAPIParam(obj, val) {
        if (val) {
            let arr = [];
            for(let i in val) {
                if (val[i]) arr.push("%" + val[i] + "%");
            }
            if (arr.length > 0) obj[this._name] = arr;
        }
    }

    getChange1(store) {
        if (store.change == null) store.change = store.value;
        if (store.change == null) return [];
        else return store.change;
    }


    setChange1(store, val) {
        if (store.change == null) store.change = [];
        store.change.push(this.clean(val));
        store.error = this.validate(val);
    }


    getFilter(store) {
        return store.value;
    }


    setFilter(store, val) {
        if (Array.isArray(val)) store.value = val;
        else if (val) store.value = [val];
    }

}