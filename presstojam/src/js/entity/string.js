import { Field } from "./field.js"
import { t, te } from "./../../js/i18n.js"


export class String extends Field {

    constructor(name, obj) {
        super(name);
        this._encrypted = false;
        this._list = null;
        this._multiple = false;
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

    getOptions() {
        let opts = [];
        if (Array.isArray(this._list)) {
            for(const item of this._list) {
                const key = "models." + this._model + ".fields." + this._name + ".options." + item;
                const label = (te(key)) ? t(key) : item;
                opts.push({ value : item, label : label });
            }
        } else {
            for(const key in this._list) {
                const tkey = "models." + this._model + ".fields." + this._name + ".options." + this._list[key];
                const label = (te(tkey)) ? t(tkey) : key;
                opts.push({ value : key, label : label});
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