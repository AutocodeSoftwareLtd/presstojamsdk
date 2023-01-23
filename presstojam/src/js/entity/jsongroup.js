import { Field } from "./field.js"

export class JsonGroup extends Field {

    constructor(name, obj) {
        super(name);
        this._fields = {};
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

 

    buildJSON(bind) {
        let obj = {};
        const group = bind.getGroup();

        for(const i in this._fields) {
            const cbind = group.getBind(i);
            if (!cbind.active.value) continue;
            if (cbind.cell.type() == "json") {
                obj[i] = this.cbind.cell.buildJSON(cbind);
            } else {
                obj[i] = cbind.value;
            }
        }
        return obj;
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