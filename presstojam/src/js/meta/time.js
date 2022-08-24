import { Field } from "./field.js"

export class Time extends Field {

    constructor(name, obj) {
        super(name);
        if (obj) this.apply(obj);
    }


    addAPIParam(obj, val) {
        let cobj = {};
        if (val) {
            if (val.min) cobj.min = val.min;
            if (val.max) cobj.max = val.max;
            if (Object.keys(cobj).length > 0) {
                obj[this._name] = cobj;
            }
        }
    }


}