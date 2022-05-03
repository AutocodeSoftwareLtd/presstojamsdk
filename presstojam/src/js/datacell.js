import { reactive, computed } from "vue"

export class DataCell {

    constructor(meta) {
        this._meta = meta;
        this._store = reactive({ value : null, display : null, error : 0, is_validate_on : false});

        this.val = computed({ 
            get : () =>  {
                return this._store.value;
            },
            set : (val) => {
                this._store.value = this._meta.clean(val);
                this._store.error = this._meta.validate(val);
            }     
        });

        this.error = computed({
            get : () => this._store.error,
            set : val => { this._store.error = val }
        });

        this.showError = computed(() => {
            return this._store.is_validate_on && this._store.error ? true : false;
        });

        if (this._meta.default_val) this._store.value = this._meta.default_val;
        else if (this._meta.type == "select") this._store.value = 0; 

        const meta_keys = Object.getOwnPropertyNames(this._meta);
        const keys = Object.keys(this);

        meta_keys.forEach(property => {
          if (property[0] != "_" && !keys.includes(property)) {
            Object.defineProperty(this, property, {
                get: function() { 
                    return this._meta[property];
                },
                set: function(newValue) {
                    this._meta[property] = newValue;
                }
            })
          }
        });

    }

    clone() {
        let cell = new DataCell(this._meta);
        cell.store.value = this._store.value;
        return cell;
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

    toVal() {
        let cval = this._store.value;
        return cval;
    }

    setVal(val) {
        this._store.value = val;
    }

    isSummary() {
        return this._meta.summary;
    }
}
