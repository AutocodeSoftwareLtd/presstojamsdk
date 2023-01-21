export class BindGroup {

    constructor() {
        this._binds = {};
        this._show_validation = false;
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

    setActiveValidation(val) {
        this._show_validation = val;
    }

    getActiveValidation() {
        return this._show_validation;
    }

    setInitActive() {
        for(let i in this._binds) {
            this.trigger(this._binds[i].cell.name, this._binds[i].value)
        }
    }

    hasErrors() {
        for(let i in this._binds) {
            if (this._binds[i].error) return true;
        }
    }

} 