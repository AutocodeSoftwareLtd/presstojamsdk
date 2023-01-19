import { ref } from "vue"

class Bind {

    constructor(cell, value) {
        this._cell = cell;
        this._error = ref(cell.validate(value));
        this._value = ref(value);
        this._is_dirty = false;
        this._active = ref(true);
        this._active_validation = ref(false);
        this._group = null;
    }
}