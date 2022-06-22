
import { Errors } from "./../error.js"
import { reactive, computed } from "vue"


export class Field {

    constructor(name) {
        this._name = name;
        this._store = reactive({ summary : 0});
        this._default_val = null;
        this._immutable = false;
        this._encrypted = false;
        this._min = null;
        this._max = null;
        this._contains = [];
        this._notcontains = [];
        this._listeners = [];
        
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

    }

    apply(obj) {
        for (let x in obj) {
            if (x == "summary") this.summary = (obj[x]) ? 1 : 0;
            else if (x == "validation") continue;
            else if (x == "type") this.type = obj[x].toLowerCase();
            else this[x] = obj[x];
        }

        this._min = obj.validation.min;
        this._max = obj.validation.max;
        if (obj.validation.contains) this._contains = obj.validation.contains.split("|");
        if (obj.validation.notcontains) this._notcontains = obj.validation.notcontains.split("|");
    }


    clean(val) {
        return val;
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


    trigger(val) {
        for(let state of this._listeners) {
            state(val);
        }
    }


    addParam(obj, val) {
        if (val) {
            obj[this._name] = val;
        }
    }


    addAPIParam(obj, val) {
        if (val) {
            obj[this._name] = val;
        }
    }


    getVal(store) {
        return store.value;
    }

    setVal(store, val) {
        store.value = this.clean(val);
        store.error = this.validate(val);
    }

    getChange(store) {
        if (store.change == null) return store.value;
        else return store.change;
    }

    setChange(store, val) {
        store.change = this.clean(val);
        store.error = this.validate(val);
        this.trigger(val);
    }

    getFilter(store) {
        return store.value;
    }
    
    setFilter(store, val) {
        store.value = val;
    }
}


