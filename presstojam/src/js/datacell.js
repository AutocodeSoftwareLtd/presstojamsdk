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

        if (this._meta.default) this._store.value = this._meta.default;
        else if (this._meta.type == "select") this._store.value = 0; 
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
}
