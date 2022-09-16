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