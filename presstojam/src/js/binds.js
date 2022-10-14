import { ref } from "vue"

export function createBind(cell, value) {
    value = cell.clean(value);
    const obj = {
        cell : cell,
        children : null,
        error : ref(cell.validate(value)),
        value : ref(value),
        is_dirty : false,
        active : ref(true),
        active_validation : ref(false),
        group : null,
        setError(error) {
            this.error.value = error;
        },
        setValue(val) {
            val = this.cell.clean(val);
            console.log("Setting value to", val);
            this.error.value = this.cell.validate(val);
            this.value.value = val;
            this.setDirty(true)
            if (this.group) this.group.setActiveBinds(this.cell.name, this.value.value);
        },
        setDirty(dirty) {
            if (dirty) {
                this.is_dirty = dirty;
                if (this.group) this.group.setDirty(dirty);
            }
        },
        activateValidation() {
            this.active_validation.value = true;
            if (this.group) this.group.activateValidation();
        }
    }


    if (cell.type == "json") {
        obj.children = createBindGroup(obj);
        for(let field in cell.fields) {
            let cvalue = (value) ? value[field] : null;
            obj.children.addBind(field, createBind(cell.fields[field], cvalue));
        }
    }

    return obj;
}



export function createBindGroup(parent = null) {

    return {
        binds : {},
        parent_bind : parent,
        is_dirty : false,
        setActiveBinds(field, value) {
            for(let i in this.binds) {
                const cell = this.binds[i].cell;
                //only need to change active value if there is a where clause
                if (cell.where && cell.where.on == field) {
                    this.binds[i].active.value = cell.where.is == value;
                }

                if (this.binds[i].children) {
                    this.binds[i].children.setActiveBinds(field, value);
                }
            }
        },
        setInitActive() {
            for(let i in this.binds) {
                this.setActiveBinds(i, this.binds[i].value.value);
                if (this.binds[i].children) {
                    this.binds[i].children.setInitActive();
                }
            }
        },
        addBind(field, bind) {
            this.binds[field] = bind;
            bind.group = this;
        },
        setDirty(dirty) {
            this.is_dirty = dirty;
            if (this.parent_bind) this.parent_bind.setDirty(dirty);
        },
        hasErrors() {
            for(let i in this.binds) {
                if (this.binds[i].error.value) {
                    console.log("Error for ", i, this.binds[i].error.value);
                    return true;
                }

                if (this.binds[i].children) {
                    if (this.binds[i].children.hasErrors()) return true;
                }
            }
        },
        activateValidation() {
            for (let i in this.binds) {
                this.binds[i].activateValidation();
            }
        }
    }
}