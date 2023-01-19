import { createView } from "../routes.js"
import { Model } from "./model.js"

/*
class ModelStore {

    constructor(client, model) {
        this._client = client;
        this._model = model;
        this._count_promise = null;
        this._load_promise = null;
        this._first_promise = null;
        this._params = {};
        this._route = createView(model);
        this._filters ={};
        this._parent_id = 0; //set if this is a child of a parent group
        this._active_id = 0;
        this._page_offset = 0;      
        this._limit = (this._route.settings.limit) ? this._route.settings.limit : 0; 

        const keys = Object.keys(this);
       
        keys.forEach(property => {
            if (property == "_parent_id" || property == "_active_id" || property == "_limit" || property == "_page_offset" || property == "_filters") {
                Object.defineProperty(this, property.substring(1), {
                    get: function() { 
                        return this[property];
                    },
                    set: function(val) {
                        this[property] = val;
                    }
                });
            } else if (property[0] == "_") {
                Object.defineProperty(this, property.substring(1), {
                    get: function() { 
                        return this[property];
                    }
                });
            }
        });
    }
        
        
    loadCount() {
        if (!this._count_promise) {
            if (!this._limit) {
                this._count_promise = Promise.resolve(true);
            } else {
                this._count_promise = this._client.get("/count/" + this._model, this.buildParams())
                .then(response => {
                    return parseInt(response.count);
                });
            }
        }
        return this.count_promise;
    }
        
    load() {
        if (!this._load_promise) {
            let url = "/data/" + this._model;
            if (this._active_id) url += "/active";
            this._load_promise = this._client.get(url, this.buildParams())
        }
        return this.load_promise;
    }

    loadFirst() {
        if (!this._first_promise) {
            let url = "/data/" + this._model + "/first";
            this._first_promise = this._client.get(url, this.buildParams())
            .then(row => {
                this._active_id = row['--id'];
            });
        }
        return this.first_promise;
    }

    reset() {
        this._load_promise = null;
        this._count_promise = null;
    }

    reload() {
        this.reset();
        return this.load();
    }


    overwrite(obj) {
        if (!obj['--id']) {
            throw "Can only overwrite store if object contains --id value";
        }
            
        if (this._index[obj['--id']] === undefined) {
            throw "Can't overwrite object of " + obj['--id'] + ", doesn't exist";
        }
                
        const index = this._index[obj['--id']];
        for(let i in obj) {
            this._data[index][i] = obj[i];
        }
    }
        
    append(obj) {
        this._index[obj['--id']]
        if (this._index[obj['--id']] !== undefined) {
            throw "Can't append row of " + obj['--id'] + ", already exists";
        }

        this._index[obj['--id']] = this._data.length;
        this._data.push(obj);
    }
        
    remove(id) {
        if (this._index[id] !== undefined) {
            const pos = this._index[id];
            this._data.splice(pos, 1);
            delete this._index[id];
        }
    }

    
    
}
*/

let cache = {};

export function getModel(model_name) {
    if (!cache[model_name]) {
        try {
            cache[model_name] = new Model(model_name);
        } catch (err) {
            console.error("Error", err);
        }
    }
    return cache[model_name];
}



export function clearModelCache() {
    cache = {};
}

export function hasModel(id) {
    return (cache[id]) ? true : false;
}
