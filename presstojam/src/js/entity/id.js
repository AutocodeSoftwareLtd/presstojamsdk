import { Field } from "./field.js"


export const ReferenceTypes = {
    'PRIMARY' : 0,
    'PARENT' : 1,
    'OWNER' : 2,
    'REFERENCE' : 3,
    'RECURSIVE' : 4,
    'CIRCULAR' : 5
}

export class ID extends Field {

    constructor(name, obj) {

        super(name);
    
        this._reference_type;
        this._reference;
        this._default_val = 0;
        this.reverse_references = [];
        this._common;
        this._custom_fields = [];
        this.buildGetterSetters();
        if (obj) this.apply(obj);

    }


    get reference() {
        return this._reference;
    }

    isReferenceType() {
        return this._reference_type == ReferenceTypes.REFERENCE || this._reference_type == ReferenceTypes.CIRCULAR;
    }


    isCircular() {
        return this._reference_type == ReferenceTypes.CIRCULAR;
    }


    get recursive() {
        return this._reference_type == ReferenceTypes.RECURSIVE;
    }


    get reference_type() {
        return this._reference_type;
    }


    get type() {
        return "id";
    }

}