import { Field } from "./field.js"
import { Asset } from "./asset.js"
import { reactive } from "vue"

export class MetaRow {

    constructor() {
        this._cells = {};
        this._children = {};
        this._states = {};
        this._limit = 0;
        this._page = 0;
        this._sort = {};
        this._groups = [];
        this._active = 0;
        this._max_pages = 0;
        this._count = 0;
        this._limited_fields = [];
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


    convertToParams() {
        let obj = {};
        if (this._limit) obj._limit = this._limit;
        if (this._page) obj._page = this._page;
        if (this._limited_fields.length > 0) obj._fields = this._limited_fields;
        if (Object.keys(this._sort).length > 0) obj._sort = this._sort;
        return obj;
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

    map(fields, custom_fields = []) {
        if (custom_fields.length > 0) {
            for(let field of custom_fields) {
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