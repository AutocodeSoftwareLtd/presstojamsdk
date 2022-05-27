import { Field } from "./field.js"
import { Asset } from "./asset.js"
import { reactive } from "vue"

export class MetaRow {

    constructor() {
        this._cells = {};
        this._children = {};
        this._states = {};
        this._active = 0;
        this._init = false;
        this._store = reactive({index : null});
      
        const keys = Object.keys(this);

        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                    return this[property];
                },
                set: function(newValue) {
                    this[property] = newValue;
                }
            });
          } 
        });
    }


    addChild(name, child) {
        this._children[name] = child;
    }

    addState(name, action) {
        this._actions[name] = action;
    }


    resetSummary(arr) {

        for(let i in this._cells) {
            this._cells[i].summary = false;
        }
        
        for(let i in arr) {
            if (this._cells[arr[i]]) {
                this._cells[arr[i]].summary = true;
            }
        }
    }

    mapField(field, obj) {
        this._cells[field] = new Field(field, obj);
        if (this._cells[field].recursive) this._store.index = field;
    }

    map(fields, limited_fields = []) {
        if (limited_fields.length > 0) {
            for(let field of limited_fields) {
                this.mapField(field, fields[field]);
            }
        } else {
            for (let i in fields) {
                this.mapField(i, fields[i]);
            }
        }
    }


    getCellByType(type) {
        let cells = {};
        for(let i in this._cells) {
            if (this._cells[i].type == type) cells[i] = this._cells[i];
        }
        return cells;
    }

}