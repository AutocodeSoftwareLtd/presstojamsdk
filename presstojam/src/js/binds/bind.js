import { ref } from "vue"

export class Bind {
    
    constructor(cell, value) {
        this._cell = cell;
        this._value = value;
        this._error = 0;
        this._is_dirty = false;
        this._bind_group; 
        this._active = ref(true);
    }

    get error() {
        return this._error;
    }

    get cell() {
        return this._cell;
    }

    get value() {
        return this._value;
    }

    get is_dirty() {
        return this._is_dirty;
    }

    get active_validation() {
        return this._bind_group.getActiveValidation();
    }

    set active_validation(val) {
        this._bind_group.setActiveValidation(val);
    }

    set active(active) {
        this._active.value = active;
    }

    get active() {
        return this._active;
    }
    
    setError(error) {
        this._error = error;
    }


    setValue(val) {
        val = this._cell.clean(val);
        this._error = this._cell.validate(val);
        this._value = val;
        this.setDirty(true)
        this._bind_group.trigger(this._cell.name, this._value);
    }

    setDirty(dirty) {
        if (dirty) {
            this._is_dirty = dirty;
        }
    }

    setGroup(group) {
        this._bind_group = group;
    }

    getGroup() {
        return this._bind_group;
    }

}
