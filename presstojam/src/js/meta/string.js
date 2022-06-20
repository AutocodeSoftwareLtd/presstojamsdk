import { Field } from "./field.js"

export class String extends Field {

    constructor(name, obj) {
        super(name, obj);
    }

    setContainsAsOptions() {
        let options = [];
        for(let exp of this._contains) {
            if (exp.indexOf(":") > -1) {
                const pts = exp.split(":");
                options.push({ key : pts[0], value : pts[1]});
            } else {
                options.push({ key : exp, value : exp});
            }
        }
        this._store.options = options;
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
}