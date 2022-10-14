import { Field } from "./field.js"

export class String extends Field {

    constructor(name, obj) {
        super(name);
        this._encrypted = false;
        this._list;
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

    getOptions() {
        let opts = [];
        if (Array.isArray(this._list)) {
            for(const item of this._list) {
                opts.push({ key : item, value : item});
            }
        } else {
            for(const key in this._list) {
                opts.push({ key : key, value : this._list[key]});
            }
        }
        return opts;
    }

    clean(val) {
        if (this._list) {
            if (Array.isArray(this._list)) {
                if (this._list.includes(val)) return val;
            } else if (this._list[val]) {
                return val;
            } else {
                return null;
            }
        } else {
            return (val) ? val.trim() : val;
        }
    }

    isEnum() {
        return (this._list) ? true : false;
    }

    get type() {
        return "string";
    }

   
}