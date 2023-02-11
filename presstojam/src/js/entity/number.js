import { Field } from "./field.js"

export class Number extends Field {
    constructor(name, obj) {
        super(name);
        this._round = 0;
        this._range = false;
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

    clean(val) {
        if (this._round) val = parseFloat(val);
        else if (val !== null && typeof val !== 'undefined') val = parseInt(val);
        
        if(isNaN(val)) val = null;
        return val;
    }

    get round() {
        return this._round;
    }

    set round(round) {
        this._round = round;
    }

    get type() {
        return "number";
    }
}