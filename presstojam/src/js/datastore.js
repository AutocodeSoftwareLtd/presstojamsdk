import Client from "./client.js"
import { createView } from "./routes.js"



class DataStore {

    constructor(model) {
        this._model = model;
        this._count_promise = null;
        this._load_promise = null;
        this._params = {};
        this._route = createView(model);
        this._filters ={};
        this._parent_id = 0; //set if this is a child of a parent group
        this._active_id = 0;
        this._page_offset = 0;      
        this._limit = (this._route.settings.limit) ? this._route.settings.limit : 0; 

        const keys = Object.keys(this);
       
        keys.forEach(property => {
            if (property == "_parent_id" || property == "_active_id" || property == "_limit" || property == "_page_offset") {
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
                this._count_promise = Client.get("/count/" + this._model, this.buildParams())
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
            this._load_promise = Client.get(url, this.buildParams())
        }
        return this.load_promise;
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

    
    buildParams() {
        let params = this._filters;
        if (this._active_id) params["--id"] = this._active_id;
        else if (this._parent_id) params["--parent"] = this._parent_id;
        if (this._limit) {
            params.__offset = this._page_offset;
            params.__limit = this._limit;
        }
        const settings = ["to", "order"];
        for(const setting of settings) {
            if (this._route.settings[setting]) params['__' + setting] = this._route.settings[setting];
            else if (params[setting]) params['__' + setting] = params[setting];
        }
    
        if (this._route.settings.fields) {
            params["__fields"] = this._route.settings.fields;//createCustomStructure(store.route);
        }
        return params;
    }
}



export function createDataStore(model_name) {

    const model = new DataStore(model_name);
    cache[model_name] = model;
    return cache[model_name];
}

export function createTemporaryStore(model) {
    return new DataStore(model);
}








let cache = {};


//need to add in search params and data settings

export function getStoreById(id) {
    if (!cache[id]) {
        throw "Error, can't access " + id + " from the cache, doesn't exist";
    }
    return cache[id];
}

export function clearDataCache() {
    cache = {};
}

export function hasStore(id) {
    return (cache[id]) ? true : false;
}
