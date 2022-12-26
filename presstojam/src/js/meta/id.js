import { Field } from "./field.js"
import { sortByDictionary, toReferenceTree } from "./../helperfunctions.js"

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
        this._cache_id;
        this._custom_fields = [];
        this._load_promise = null;
        this.buildGetterSetters();
        if (obj) this.apply(obj);

    }


    getOptions(client, model, id) {
        if (!this._load_promise || id != this._cache_id) {
            this._cache_id = id;
            let url = "/reference/" + model + "/" + this._name;
            if (id) url += "/" + id;
            this._load_promise = client.get(url)
            .then(response => {
                response.sort(sortByDictionary);
                return response;
            });
        }
        return this._load_promise
    }


    
    getRecursiveOptions(client, model, id, schema) {
        if (!this._load_promise) {
            this._cache_id = id;
            let url = "/reference/" + model + "/" + this._name;
            if (id) url += "/" + id;
            this._load_promise = client.get(url)
            .then(response => {
                return toReferenceTree(response, schema)
            });
        }
        return this._load_promise;
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