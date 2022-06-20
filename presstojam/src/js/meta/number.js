import { Field } from "./field.js"

export class Number extends Field {
    constructor(name, obj) {
        super(name, obj);
        this._round = 0;
    }
}