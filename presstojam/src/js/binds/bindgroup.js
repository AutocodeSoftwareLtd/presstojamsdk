import { ref, computed } from "vue"

export class BindGroup {

    constructor() {
        this._binds = {};
    }

    showValidation(val) {
        for(const i in this._binds) {
            this._binds[i].setShowError(val);
        }
    }

    regBind(i, bind) {
        this._binds[i] = bind;
        bind.setGroup(this);
    }

    getBind(i) {
        return this._binds[i];
    }

    trigger(field, value) {
        for(let i in this._binds) {
            const cell = this._binds[i].cell;
            //only need to change active value if there is a where clause
            if (cell.where && cell.where.on == field) {
                this._binds[i].active = cell.where.is == value;
            }
        }
    }


    setInitActive() {
        for(let i in this._binds) {
            this.trigger(this._binds[i].cell.name, this._binds[i].value)
        }
    }

    hasErrors() {
        for(let i in this._binds) {
            if (this._binds[i].error.value) return true;
        }
    }

} 