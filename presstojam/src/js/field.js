
import { Errors } from "./error.js"
import { reactive, computed } from "vue"
import Client from "./client.js"


export class Field {

    constructor(name, obj = null) {
        this._name = name;
        this._type = "";
        this._atts={}
        this._confirm = false;
        this._reference = "";
        this._label = "";
        this._store = reactive({ summary : 0, options : []});
        this._default_val = null;
        this._immutable = false;
        this._encrypted = false;
        this._min = null;
        this._max = null;
        this._contains = [];
        this._notcontains = [];
        this._recursive = false;
        this._error = {
            'OK' : 0,
            'MIN_VALUE' : 1,
            'MAX_VALUE' : 2,
            'HAS' : 3,
            'HAS_NOT' : 4
        }

        const keys = Object.keys(this);
       
        keys.forEach(property => {
          if (property != "_store" && property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                   return this[property];
                },
                set: function(newValue) {
                    if (property == "_type") this._type = newValue.toLowerCase();
                    else this[property] = newValue;
                }
            })
          }
        });
      
      
        this.summary = computed({
            get : () => {
                return this._store.summary;
            },
            set : (val) => {
                this._store.summary = (val) ? 1 : 0;
            }
        })

        this.options = computed({
            get : () => {
                return this._store.options;
            },
            set : (options) => {
                this._store.options = options;
            }
        });

       
        if (obj) {
            for (let x in obj) {
                if (x == "summary") this.summary = (obj[x]) ? 1 : 0;
                else if (x == "validation") continue;
                else if (x == "type") this.type = obj[x].toLowerCase();
                else this["_" + x] = obj[x];
            }

            this._min = obj.validation.min;
            this._max = obj.validation.max;
            if (obj.validation.contains) this._contains = obj.validation.contains.split("|");
            if (obj.validation.notcontains) this._notcontains = obj.validation.notcontains.split("|");
        }
    }


    getOption(key) {
        for(let opt of this._store.options) {
            if (opt.key == key) return opt.value;
        }
    }

    setReferenceOptions(url, params) {
        this._store.options = [];
        return Client.get(url, params)
        .then(response => {
            for (let i in response) {
                let key = response[i]["--id"];
                let vals = [];
                for(let x  in response[i]) {
                    if (x != "--id") {
                        vals.push(response[i][x]);
                    }
                }
                this._store.options.push({ key: key, value: vals.join(" ", vals) });
            }
        })
        .catch(e => {
            console.log(e);
        });
    }

    setContainsAsOptions() {
        this._store.options = [];
        for(let exp of this._contains) {
            this._store.options.push({ key : exp, value : exp});
        }
    }

    clean(val) {
        if (this._type == "checkbox") return (val) ? 1 : 0;
        else return val;
    }


    calcValue(value) {
        if (!value) return "";
        else return value;
    }


    validateSize(val) {
        if (val < this._min) return Errors.MIN_VALUE;
        else if (val > this._max) return Errors.MAX_VALUE;
        else return Errors.OK;
    }


    validate(val) {
        if (val === null) return;
        let err;
        if (isNaN(val)) {
            const length = (val) ? val.length : 0;
            err = this.validateSize(length);
        } else {
            err = this.validateSize(val);
        }
        if (err != Errors.OK) return err;

        for(let nhas of this._notcontains) {
            if (val.match(nhas)) return Errors.HAS_NOT;
        }

        if (this._contains.length == 0) return Errors.OK;
        
        for(let has of this._contains) {
            if (val.match(has)) return Errors.OK;
        }
        return Errors.HAS;
    }


}


