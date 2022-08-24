import { reactive} from "vue"
import { createField } from "./meta/fieldfactory.js"
import client from "./client.js"

const store = {};
const state_groups = {};


export async function getMeta(model, params = {}) {
    if (store[model]) return Promise.resolve(store[model]);

    //otherwise we have to load
    return client.get("/meta/" + model, params)
    .then(response => {
        store[model] = {};

        const fields = response.fields;
       
        for (let i in fields) {
            const field = fields[i];

            store[model][i] = createField(i, field);

            if (field.states) {
                state_groups[i] = {};
                for(const state of field.states) {
                    if (!state_groups[i][state.depends_on]) state_groups[i][state.depends_on] = [];
                    state_groups[i][state.depends_on].push(state); 
                }
            }
        }
        return store[model];
    });
}

/*
export class MetaRow {

    constructor() {
        this._cells = {};
        this._children = [];
        this._active = 0;
        this._init = false;
        this._store = reactive({index : null});
        this._state_groups = {};
      
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

    setStates(fields) {
        for(let i in fields) {
            let groups = {};
            if (fields[i].states) {
                for(const state of fields[i].states) {
                    if (!groups[state.depends_on]) groups[state.depends_on] = [];
                    groups[state.depends_on].push(state); 
                }
            }
            this._state_groups[i] = groups;
        }
    }

    mapField(field, obj) {
        this._cells[field] = createField(field, obj);
         
        if (this._cells[field].recursive) {
            this._store.index = field;
        }
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
        this.setStates(fields);
    }


    getCellByType(type) {
        let cells = {};
        for(let i in this._cells) {
            if (this._cells[i].type == type) cells[i] = this._cells[i];
        }
        return cells;
    }

    showAll() {
        for(let i in this._cells) {
            this._cells[i].summary = true;
        }
    }

}
*/