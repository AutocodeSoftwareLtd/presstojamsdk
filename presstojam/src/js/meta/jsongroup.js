import { Field } from "./field.js"

export class JsonGroup extends Field {

    constructor(name, obj) {
        super(name);
        this._fields = {};
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

   

    buildJSONFromGroup(bindGroup) {
        let obj = {};
        for(let i in bindGroup.binds) {
            const cbind = bindGroup.binds[i];
            if (!cbind.active.value) continue;
            if (cbind.children) {
                obj[i] = this.buildJSONFromGroup(cbind.children);
            } else {
                obj[i] = cbind.value.value;
            }
        }
        return obj;
    }

    buildJSON(bind) {
        return this.buildJSONFromGroup(bind.children);
    }


    clean(val) {
        if (typeof val === 'string') {
            return JSON.parse(val);
        } else {
            return val;
        }
    }


    get type() {
        return "json";
    }

   
}