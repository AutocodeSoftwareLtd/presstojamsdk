
import Errors from "./error.js"
import { reactive, computed } from "vue"
import Client from "./client.js"


export class Field {

    constructor(name, obj = null) {
        this._name = name;
        this._type = "";
        this._atts={}
        this._confirm = false;
        this._reference = "";
        this._error = 0;
        this._label = "";
        this._store = reactive({ summary : 0, options : [], value :  null, is_validate_on : false, error : 0});
        this._default_val = null;
        this._encrypted = false;
        this._min = null;
        this._max = null;
        this._contains = [];
        this._notcontains = [];
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
                    if (property == "_error") {
                        if (!this._error) return "";
                        else if (isNaN(this._error)) return this._error;
                        else return Errors.getError(this._error);
                    } else {
                        return this[property];
                    }
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
                this._store.summary = val;
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
                if (x == "summary") this._store.summary = obj[x];
                else if (x == "validation") continue;
                else if (x == "type") this.type = obj[x].toLowerCase();
                else this["_" + x] = obj[x];
            }

            this._min = obj.validation.min;
            this._max = obj.validation.max;
            if (obj.validation.contains) this._contains = obj.validation.contains.split("|");
            if (obj.validation.notcontains) this._notcontains = obj.validation.notcontains.split("|");
        }

        if (!this._reference && this._type == "select") {
            this._store.options = [];
            try {
                for (let opt of this._atts.options) {
                    this._store.options.push({ key: opt, value: opt });
                }
            } catch (e) {
                console.log("options not set for ", this._name);
            }
        }



        this.val = computed({ 
            get : () =>  {
                return this._store.value;
            },
            set : (val) => {
                this._store.value = this.clean(val);
                this._store.error = this.validate(val);
            }     
        });

        this.error = computed({
            get : () => this._store.error,
            set : val => { this._store.error = val }
        });

        this.showError = computed(() => {
            return this._store.is_validate_on && this._store.error ? true : false;
        });

        if (this.default) this._store.value = this.default;
        else if (this._type == "select") this._store.value = 0; 


        if (this._type == "datetime") {
            this._store.value = {min : null, max : null };

            this.val = computed({
                get : () =>  {
                    return this._store.value;
                },
                set : (val) => {
                    if (val.min) this._store.value.min = val.min;
                    if (val.max) this._store.value.max = val.max;
                    this._store.error = this.validate(val);
                }  
            });

            this.val1 = computed({
                get : () =>  {
                    return this._store.value.min;
                },
                set : (val) => {
                    this._store.value.min = val;
                    this._store.error = this.validate(val);
                }     
            });

            this.val2 = computed({
                get : () =>  {
                    return this._store.value.max;
                },
                set : (val) => {
                    this._store.value.max = val;
                    this._store.error = this.validate(val);
                }     
            });

            this.addParam = obj => {
                let cobj = {};
                if (this._store.value.min) cobj.min = this._store.value.min;
                if (this._store.value.max) cobj.max = this._store.value.max;
                if (Object.keys(cobj).length > 0) obj[this._name] = cobj;
            };


        } else if (this._type == "flag") {
            this._store.value = 0;

            this.addParam = (obj) => {
                if (this._store.value == 1) {
                    obj[this._name] = 1;
                } else if (this._store.value == 2) {
                    obj[this._name] = 0;
                }
            }

        } else if (this._type == "str") {
            this._store.value = [];

            this.addParam = obj => {
                if (this._store.value.length > 0) obj[this._name] = this._store.value;
            }

        } else {

            this.addParam = obj => {
                if (this._store.value) obj[this._name] = ["%" + this._store.value + "%"];
            }

        }

    }



    setReferenceOptions(url, params) {
        this._store.options = [];
        return Client.get(url, params)
        .then(response => {
            for (let i in response.__data) {
                if (i.indexOf("__") === 0) continue;
             
                this._store.options.push({ key: response.__data[i].key, value: response.__data[i].value });
            }
        })
        .catch(e => {
            console.log(e);
        });
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
        if (val < this._min) return this._error.MIN_VALUE;
        else if (val > this._max) return this._error.MAX_VALUE;
        else return this._error.OK;
    }


    validate(val) {
        let err;
        if (isNaN(val)) {
            const length = (val) ? val.length : 0;
            err = this.validateSize(length);
        } else {
            err = this.validateSize(val);
        }
        if (err != this._error.OK) return err;

        for(let nhas of this._notcontains) {
            if (val.match(nhas)) return this._error.HAS_NOT;
        }

        if (this._contains.length == 0) return this._error.OK;
        
        for(let has of this._contains) {
            if (val.match(this._contains)) return this._error.OK;
        }
        return this._error.HAS;
    }


}


