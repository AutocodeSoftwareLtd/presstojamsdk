import { Field } from "./field.js"
import { Asset } from "./asset.js"

export class MetaRow {

    constructor() {
        this._fields = {};
        this._primary;
        this._parent;
        this._children = {};
    }

    set field(field) {
        this._fields[field.name] = field;
    }

    get fields() {
        return this._fields;
    }

    addChild(name, child) {
        this._children[name] = child;
    }


    get children() {
        return this._children;
    }


    get parent() {
        return this._parent;
    }

  
    get primary() {
        return this._primary;
    }

    map(fields) {
        for (let i in fields) {
            if (fields[i].is_primary) this._primary = new Field(i, fields[i]);
            else if (fields[i].is_parent) this._parent = new Field(i, fields[i]);
            else  this._fields[i] = new Field(i, fields[i]);
        }
    }


    exportFields(state, store) {
        let cfields = this._states[state].fields;
        store.fields = [];
        for(let i in cfields) {
            if (this._limit_fields.length == 0 || this._limit_fields.contains(i)) {
                store.fields.push(cfields[i]);
            }
        }
    }

    exportToStore(store) {
       store.fields = this._fields;
    }

    getCellByType(type) {
        let cells = {};
        for(let i in this._fields) {
            if (this._fields[i].type == type) cells[i] = this._fields[i];
        }
        return cells;
    }
}