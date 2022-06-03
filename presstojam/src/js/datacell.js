import { reactive, computed } from "vue"
import { getError } from "./error.js"

export class DataCell {

    constructor(meta) {
        this._meta = meta;
        this._store = reactive({ value: null, change: null, display: null, error: 0, is_validate_on: false });


        const meta_keys = Object.getOwnPropertyNames(this._meta);
        const keys = Object.keys(this);

        meta_keys.forEach(property => {
            if (property[0] != "_" && !keys.includes(property)) {
                Object.defineProperty(this, property, {
                    get: function () {
                        return this._meta[property];
                    },
                    set: function (newValue) {
                        this._meta[property] = newValue;
                    }
                })
            }
        });


        this.error = computed({
            get: () => { getError(this._store.error); },
            set: val => { this._store.error = val }
        });

        this.showError = computed(() => {
            return this._store.is_validate_on && this._store.error ? true : false;
        });

        if (this._meta.default_val) this._store.value = this._meta.default_val;
        else if (this._meta.type == "select") this._store.value = 0;

        this.val = computed({
            get: () => {
                return this._store.value;
            },
            set: (val) => {
                this._store.value = this._meta.clean(val);
                this._store.error = this._meta.validate(val);
            }
        });

        this.change = computed({
            get: () => {
                if (this._store.change == null) return this._store.value;
                else return this._store.change;
            },
            set: (val) => {
                this._store.change = this._meta.clean(val);
                this._store.error = this._meta.validate(val);
            }
        });

        this.addParam = obj => {
            if (this._store.value) {
                obj[this.name] = this._store.value;
            }
        }


        if (this.type == "time") {

            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.min;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null };
                    this._store.change.min = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
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
                    this._store.change.max = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
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
                        obj[this.name] = cobj;
                    }
                }
            }


        } else if (this.type == "flag") {

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
                    this._store.change = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
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
                    obj[this.name] = this._store.value;
                }
            }


        } else if (this.type == "id") {
            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    let val = (this._store.change == null) ? [] : this._store.change;
                    return val;
                },
                set: (val) => {
                    if (this._store.change == null) this._store.change = [];
                    if (this._store.change.includes(val)) return;
                    this._store.change.push(this._meta.clean(val));
                    this._store.error = this._meta.validate(val);
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
                    obj[this.name] = this._store.value;
                }
            }

            
        } else if (this.type == "number") {
            this.change1 = computed({
                get: () => {
                    if (this._store.change == null) this._store.change = this._store.value;
                    if (!this._store.change) return "";
                    return this._store.change.min;
                },
                set: (val) => {
                    if (!this._store.change) this._store.change = { min: null, max: null }
                    this._store.change.min = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
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
                    this._store.change.max = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
                }
            });

            this.addAPIParam = obj => {
                if (this._store.value!= null) {
                    obj[this.name] = this._store.value;
                }
            }

        } else if (this.type == "string") {

            this.change = computed({
                get: () => {
                    if (this._store.change == null) return "";
                    else return this._store.change;
                },
                set: (val) => {
                    this._store.change = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
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
                    this._store.change.push(this._meta.clean(val));
                    this._store.error = this._meta.validate(val);
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
                    if (arr.length > 0) obj[this.name] = arr;
                }
            }

        } 


        

    }


    get meta() {
        return this._meta;
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

    toString() {
        return this._store.display;
    }

    isSummary() {
        return this._meta.summary;
    }

    setReferenceOptions(url, params) {
        this._meta.setReferenceOptions(url, params);
    }

    reset() {
        this._store.change = null;
        this._store.value = null;
    }

    getOption(key) {
        if (this._meta.type == 'string') return key;
        else return this._meta.getOption(key);
    }
}
