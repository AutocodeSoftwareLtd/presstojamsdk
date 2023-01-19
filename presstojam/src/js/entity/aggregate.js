import { Field } from "./field.js"
import { getClient } from "./../client.js"

const Client = getClient();

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