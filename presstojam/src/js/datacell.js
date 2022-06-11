import { reactive, computed } from "vue"
import { Map } from "./map.js"

export class DataCell {

    constructor(meta) {
        this._store = reactive({ 
            meta : meta, 
            value: null, 
            change: null, 
            display: null, 
            error: 0, 
            is_validate_on: false 
        });


        const meta_keys = Object.getOwnPropertyNames(meta);
        const keys = Object.keys(this);

        const _self = this;
        meta_keys.forEach(property => {
            if (property[0] != "_" && !keys.includes(property)) {
                this[property] = computed({
                    get: function () {
                        return _self.store.meta[property];
                    },
                    set: function (newValue) {
                        _self.store.meta[property] = newValue;
                    }
                })
            }
        });



        this.error = computed({
            get: () => { this._store.error; },
            set: val => { this._store.error = parseInt(val); this._store.is_validate_on = true; }
        });

        this.showError = computed(() => {
            let res = this._store.is_validate_on && this._store.error ? true : false;
            if (res) {
                console.log("Error details", this._store);
            }
            return this._store.is_validate_on && this._store.error ? true : false;
        });

        if (this._store.meta.default_val) this._store.value = this._store.meta.default_val;
        else if (this._store.meta.type == "select") this._store.value = 0;

        this.val = computed({
            get: () => {
                return this._store.value;
            },
            set: (val) => {
                this._store.value = this._store.meta.clean(val);
                this._store.error = this._store.meta.validate(val);
            }
        });

        this.change = computed({
            get: () => {
                if (this._store.change == null) return this._store.value;
                else return this._store.change;
            },
            set: (val) => {
                this._store.change = this._store.meta.clean(val);
                this._store.error = this._store.meta.validate(val);
                this._store.meta.trigger(val);
            }
        });

        this.addParam = obj => {
            if (this._store.value) {
                const name = this.name;
                console.log("Param is ", this.name.value);
                obj[this.name.value] = this._store.value;
            }
        }


        if (meta.type == "time") {

            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.min;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null };
                    this._store.change.min = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.change2 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.max;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null };
                    this._store.change.max = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.filter = computed({
                get: () => {
                    return this._store.value;
                },
                set:(val) => {
                    if (val) {
                        this._store.value = val;
                    }
                }
            });

            this.addAPIParam = obj => {
                let cobj = {};
                if (this._store.value) {
                    if (this._store.value.min) cobj.min = this._store.value.min;
                    if (this._store.value.max) cobj.max = this._store.value.max;
                    if (Object.keys(cobj).length > 0) {
                        obj[this.name.value] = cobj;
                    }
                }
            }


        } else if (meta.type == "flag") {

            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (this._store.change == null) return 0;
                    else if (!this._store.change) return 2;
                    else return this._store.change;
                },
                set: (val) => {
                    if (val == 0) {
                        this._store.change = null;
                        return;
                    }
                    if (val == 2) val = 0;
                    this._store.change = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.filter = computed({
                get: () => {
                    return this._store.value;
                },
                set:(val) => {
                    this._store.value = val;
                }
            });

            this.addAPIParam = obj => {
                if (this._store.value) {
                    obj[this.name.value] = this._store.value;
                }
            }


        } else if (meta.type == "id") {
            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    let val = (this._store.change == null) ? [] : this._store.change;
                    return val;
                },
                set: (val) => {
                    if (this._store.change == null) this._store.change = [];
                    if (this._store.change.includes(val)) return;
                    this._store.change.push(this._store.meta.clean(val));
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.filter = computed({
                get: () => {
                    return this._store.value;
                },
                set:(val) => {
                    this._store.value = val;
                }
            });

            this.addAPIParam = obj => {
                if (this._store.value!= null) {
                    obj[this.name.value] = this._store.value;
                }
            }

            
        } else if (meta.type == "number") {
            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.min;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null }
                    this._store.change.min = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.filter = computed({
                get: () => {
                    return this._store.value;
                },
                set:(val) => {
                    this._store.value = val;
                }
            });

            this.change2 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.max;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null }
                    this._store.change.max = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                }
            });

            this.addAPIParam = obj => {
                if (this._store.value!= null) {
                    obj[this.name.value] = this._store.value;
                }
            }

        } else if (meta.type == "string") {

            this.change = computed({
                get: () => {
                    if (this._store.change == null) return "";
                    else return this._store.change;
                },
                set: (val) => {
                    this._store.change = this._store.meta.clean(val);
                    this._store.error = this._store.meta.validate(val);
                    this._store.meta.trigger(val);
                }
            });

            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (this._store.change == null) return [];
                    else return this._store.change;
                },
                set: (val) => {
                    if (this._store.change == null) this._store.change = [];
                    this._store.change.push(this._store.meta.clean(val));
                    this._store.error = this._store.meta.validate(val);
                }
            });


            this.filter = computed({
                get: () => {
                    return this._store.value;
                },
                set:(val) => {
                    if (Array.isArray(val)) this._store.value = val;
                    else if (val) this._store.value = [val];
                }
            });

            this.addAPIParam = obj => {
                if (this._store.value) {
                    let arr = [];
                    for(let i in this._store.value) {
                        if (this._store.value[i]) arr.push("%" + this._store.value[i] + "%");
                    }
                    if (arr.length > 0) obj[this.name.value] = arr;
                }
            }

        } 


        

    }


    get meta() {
        return this._store.meta;
    }

    set validateon(on) {
        this._store.is_validate_on = on;
    }

    set display(display) {
        this._store.display = display;
    }

    get display() {
        if (this._store.display) return this._store.display;
        else return this._store.value;
    }

    get store() {
        return this._store;
    }

    resetMeta(meta) {
        this._store.meta = meta;
        if (meta.reference) {
            let url = "/reference/" + Map.model + "/" + this.name;
            let obj = {};
            if (Map.state == "primary") obj["--id"] = Map.key;
            else obj["--parentid"] = Map.key;
            this._store.meta.setReferenceOptions(url, obj);
        }
    }

    toString() {
        return this._store.display;
    }

    isSummary() {
        return this._store.meta.summary;
    }

    setReferenceOptions(url, params) {
        this._store.meta.setReferenceOptions(url, params);
    }

    setContainsAsOptions() {
        this._store.meta.setContainsAsOptions();
    }

    reset() {
        this._store.change = null;
        this._store.value = null;
    }

    getOption(key) {
        if (this._store.meta.type == 'string') return key;
        else return this._store.meta.getOption(key);
    }

    
}
