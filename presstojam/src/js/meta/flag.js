import { Field } from "./field.js"

export class Flag extends Field {

    constructor(name, obj) {
        super(name, obj);
    }


    clean(val) {
        return (val) ? 1 : 0;
    }
}