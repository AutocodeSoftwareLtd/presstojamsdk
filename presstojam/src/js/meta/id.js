import { Field } from "./field.js"
import Client from "./../client.js"

export class ID extends Field {

    constructor(name, obj) {

        super(name);
        
        this._reference = false;
        this._include_fields = [];
        this._recursive = false;
        this._reference_to;

        this._default_val = 0;
        if (obj) this.apply(obj);
        if (obj.includes) this._include_fields = obj.includes;
        if (obj.reference_to) this.referenceTo = obj.reference_to;
    }


    setReferenceOptions(url, params) {
        return Client.get(url, params)
        .then(response => {
            let options = [];
            for (let i in response) {
                let key = response[i]["--id"];
                let vals = [];
                for(let x  in response[i]) {
                    if (x != "--id") {
                        vals.push(response[i][x]);
                    }
                }
                options.push({ key: key, value: vals.join(" ", vals) });
            }
           return options;
        })
        .catch(e => {
            console.log(e);
        });
    }


    getChange1(store) {
        if (store.change == null) store.change = store.value;
        let val = (store.change == null) ? [] : store.change;
        return val;
    }

    
    setChange1(store, val) {
        if (store.change == null) store.change = [];
        if (store.change.includes(val)) return;
        store.change.push(this.clean(val));
        store.error = this.validate(val);
    }

    get reference() {
        return this._reference;
    }

    set reference(ref) {
        this._reference = ref;
    }

    get include_fields() {
        return this._include_fields;
    }

    set include_fields(fields) {
        this._include_fields = fields;
    }

    get recursive() {
        return this._recursive;
    }

    set recursive(recursive) {
        this._recursive = recursive;
    }

    get referenceTo() {
        return this._reference_to;
    }

    set referenceTo(ref) {
        this._reference_to = ref;
    }

}