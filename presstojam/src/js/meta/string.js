import { Field } from "./field.js"

export class String extends Field {

    constructor(name, obj) {
        super(name);
        this._encrypted = false;
        this._options = {};
        this.buildGetterSetters();
        if (obj) this.apply(obj);
    }

    setContainsAsOptions() {
        let opts = [];
        for(let exp of this._contains) {
            if (exp.indexOf(":") > -1) {
                const pts = exp.split(":");
                opts.push({ key : pts[0], value : pts[1]});
            } else {
                opts.push({ key : exp, value : exp});
            }
        }
        return opts;
    }

    clean(val) {
        if (this.isEnum()) {
            for(let exp of this._contains) {
                if (exp.indexOf(":") > -1) {
                    const pts = exp.split(":");
                    if (pts[0] == val) return pts[1];
                }
            }
        }
        
        return val;
    }

    isEnum() {
        if (this._contains.length < 2) return false; //not enum if length is one
        for(let exp of this._contains) {
            if (exp[0] == "/") return false; //not enum if anything is a regular expression
        }
        return true;
    }

    get type() {
        return "string";
    }

   
}