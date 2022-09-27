import { Field } from "./field.js"

export class Flag extends Field {

    constructor(name, obj) {
        super(name);
        if (obj) this.apply(obj);
        this.buildGetterSetters();
    }


    clean(val) {
        return (val) ? 1 : 0;
    }

    display(val) {
        if (this._contains.length > 0) return this._contains[val];        
        else return '';
    }

    useIcons() {
        return (!this._contains.length) ? true : false; 
    }


    get type() {
        return "flag";
    }
}