import { Field } from "./field.js"
import Client from "./../client.js"

export class Asset extends Field {

    constructor(name, obj) {
        super(name);
        this._type;
        if (obj) this.apply(obj);
    }

    
     
} 