import { Field } from "./field.js"
import { Asset } from "./asset.js"

export class MetaRow {

    constructor() {
        this._cells = {};
        this._primary = false;
        this._parent = false;
        this._children = {};
        this._states = {};
        this._limit = 0;
        this._page = 0;
        this._sort = {};
        this._groups = [];
        this._index = null;
        this._children = [];
        this._active = 0;
        this._max_pages = 0;
        this._count = 0;
        this._key = 0;
        this._limited_fields = [];


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


    convertToParams() {
        let obj = {};
        if (this._limit) obj._limit = this._limit;
        if (this._page) obj._page = this._page;
        if (this._limited_fields.length > 0) obj._fields = this._limited_fields;
        if (Object.keys(this._sort).length > 0) obj._sort = this._sort;
        for(let i in this._cells) {
            let param = this._cells[i].toVal();
            if (param) obj[i] = param;
        }
        return JSON.stringify(obj);
    }

    convertDataToParams() {
        let obj = {};
        for(let i in this._cells) {
            obj[i] = this._cells[i].toVal();
        }
        return (Object.keys(obj).length > 0) ? JSON.stringify(obj) : null;
    }


    convertToAPIParams(state) {
        let obj = {};
        if (this._limit) obj.__limit = this._limit;
        if (this._page) obj.__page = (this._page * this._limit);
        if (this._limited_fields) obj.__fields = this._limited_fields;
        if (Object.keys(this._sort).length > 0) obj.__sort = this._sort;
        for(let i in this._cells) {
            this._cells[i].addParam(obj);
        }

        if (this._key) obj.__key = this._key;
        return (Object.keys(obj).length) ? obj : null;
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

    map(fields) {
        for (let i in fields) {
            if (fields[i].is_primary) this._primary = new Field(i, fields[i]);
            else if (fields[i].is_parent) this._parent = new Field(i, fields[i]);
            else {
                this._cells[i] = new Field(i, fields[i]);
                if (fields[i].circular) this._index = i;
            }
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
       store.fields = this._cells;
    }

    getCellByType(type) {
        let cells = {};
        for(let i in this._cells) {
            if (this._cells[i].type == type) cells[i] = this._cells[i];
        }
        return cells;
    }


    applyMap(map) {
        if (map.key == "first") this._limit = 1;
        else if (map.key) this._key = map.key;

        if (map.param_str) {
            const obj = JSON.parse(map.param_str);
            if (obj._limit) this._limit = obj._limit;
            if (obj._fields) this._cells = obj._fields;
            if (obj.hasOwnProperty("_page")) this._page = obj._page;
            if (obj.hasOwnProperty("_sort")) this._sort = obj._sort;
            for(const i in this._cells) {
                if (obj.hasOwnProperty(i)) this._cells[i].setVal(obj[i]);
            }
        }
    }


    applySettings(settings) {
        
        if (settings.groups) {
           this._groups = settings.groups;
        }
     
        if (settings.limit) {
            this._limit = settings.limit;
        }
    }
}