import { Field } from "./field.js"
import Client from "./../client.js"

export class Aggregate extends Field {

    constructor(name, obj) {
        super(name);
        this._ws;
        this._fields = fields;
        if (obj) this.apply(obj);
        this.buildGetterSetters();
    }

    get type() {
        return "asset";
    }
     
} 