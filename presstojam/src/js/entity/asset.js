import { Field } from "./field.js"


export class Asset extends Field {

    constructor(name, obj) {
        super(name);
        this._type;
        if (obj) this.apply(obj);
        this.buildGetterSetters();
    }

    get type() {
        return "asset";
    }
     
} 