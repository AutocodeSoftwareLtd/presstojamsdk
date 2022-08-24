import Client from "./client.js"
import { reactive } from "vue"
import { FilterMatchMode,FilterOperator } from 'primevue/api';

class DataStore {
    constructor(model) {
        this._model = model;
        this._store = reactive({ data : [], selected : null, active : {}, filters : {}, limit : null, page : 0 });
        this._index = {};

        const keys = Object.keys(this);
       
        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                   return this[property];
                },
                set: function(newValue) {
                    if (property == "_type") this._type = newValue.toLowerCase();
                    else this[property] = newValue;
                }
            })
          }
        });
    }

    buildParams() {
        let params = this._store.filters;
        if (this._store.limit) params.__limit = this._store.limit;
        if (this._store.page) params.__page = this._store.page;
        return params;
    }


    load() {
        return Client.get("/data/" + this._model, this.buildParams())
        .then(response => {
            this._index = {};
            this._store.data = [];
            for(let i in response) {
                this._index[response[i]['--id']] = i;
            }
            this._store.data = response;
        });
    }


    createData() {
        return Client.post("/data/" + this._model, this._selected)
        .then(() => {
            this.load();
        });
    }
    
    
    updateData() {
        return Client.put("/data/" + this._model, this._selected)
        .then(() => {
            this.load();
        });
    }

    createFilters(cells) {
        for(let i in cells) {
            if (cells[i].type == "asset") continue;
            this._store.filters[i] = { value : null, matchMode: FilterMatchMode.EQUALS }
        }
    }

    
}

const source = {};
const refs = {};

//need to add in search params and data settings



export function getData(model) {
    if (source[model]) return source[model];
    source[model] = new DataStore(model);
    source[model].load();
    return source[model];
};

export function getReference(model, field, id) {
    let uri = model + "-" + field;
    if (refs[uri]) return Promise.resolve(refs[uri]);
    refs[uri] = [];
    return Client.get("/reference/" + model + "/" + field + "/" + id)
    .then(response => {
        refs[uri] = response;
        return refs[uri];
    });
}
