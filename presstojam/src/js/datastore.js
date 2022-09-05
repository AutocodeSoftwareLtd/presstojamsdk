import Client from "./client.js"
import { reactive } from "vue"
import { getRoute } from "./routes.js"
import { getReference } from "./refs.js"



class DataStore {
    constructor(model, params = {}) {
        this._model = model;
        this._params = params;
        this._init_promise = false;
        this._load_promise = false;
        this._refs = {};
        this._store = reactive({ 
            model : model,
            data : [], 
            route : {}, 
            selected : null, 
            active : {}, 
            filters : {},  
            count : 0,
            rows_per_page : 0,
            slug_trail : []
        });
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

        if (params["--id"]) this._store.active["--id"] = params["--id"];
    }

    set params(params) {
        this._params = params;
    }

    set paginate(pag) {
        this._params["limit"] = pag.first + "," + pag.rows;
    }


    buildParams() {
        let params = this._store.filters;
        if (this._params["--parentid"]) params["--parentid"] = this._params["--parentid"];
        if (this._params.limit) params.__limit = this._params.limit;
        const settings = ["to", "fields", "order"];
        for(const setting of settings) {
            if (this.store.route.settings[setting]) this._params['__' + setting] = this.store.route.settings[setting]
        }
        return params;
    }

    init() {
        if (this._init_promise) return this._init_promise;
        this._init_promise = getRoute(this._model)
        .then(route => {
            this._store.route = route;
            if (route.settings.limit && !this._params["--id"]) {
                return Client.get("/count/" + this._model, this.buildParams())
                .then(response => {
                    this._store.count = response.count;
                    this._params["limit"] = "0," + route.settings.limit;
                    this._store.rows_per_page = route.settings.limit;
                });
            }
        })
        .catch(e => console.log(e));
        return this._init_promise;
    }




    load() {
        if (!this._load_promise) {
            this._load_promise = this.init()
            .then(() => {
                return Client.get("/data/" + this._model, this.buildParams())
            }).then(response => {
                this._index = {};
                this._store.data = [];
                for(let i in response) {
                    this._index[response[i]['--id']] = i;
                }
                this._store.data = response;
                if (this._params["--id"]) {
                    this._store.active = this._store.data[this._index[this._params["--id"]]];
                }
            })
            .catch(e => console.log(e));
        }
        return this._load_promise;
    }

    reload() {
        this._load_promise = null;
        return this.load();
    }


    saveAssets() {
        let promises = [];
        for(let i in this._store.route.schema) {
            if (this._store.route.schema[i].type == "asset") {
                if (this._store.active[i]) {
                    promises.push(this._store.active[i].save("/asset/" + this._model + "/" + i + "/" + this._store.active["--id"]));
                }
            }
        }
        return Promise.all(promises);
    }


    setErrors(err) {
        if (typeof err == "string") {
            this._store.errors.__global = err;
        } else {
            return err.json()
            .then(response => {
                const msg = response.exception[0];
                if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                    for(let i in err) {
                        if (i.indexOf("__") === 0) continue;
                        this._store.errors[i] = err[i];
                    }
                }
            });
        }
    }


    createData() {
        return Client.post("/data/" + this._model, this._store.active)
        .then(response => {
            this._store.active["--id"] = response["--id"];
            return this.saveAssets();
        })
        .then(() => {
            this.load();
        }).catch(err => {
            this.setErrors(err);
        });

    }

    getDataById(id) {
        if (!this._index[id]) return null;
        return this._store.data[this._index[id]];
    }
    
    
    updateData() {
        return Client.put("/data/" + this._model, this._store.active)
        .then(() => {
            return this.saveAssets();
        }).then(() => {
            this.load();
        }).catch(err => {
            this.setErrors(err);
        });
    }

    save() {
        if (this._store.active["--id"]) return this.updateData();
        else return this.createData();
    }

    deleteData() {
        return Client.delete("/data/" + this._model, this._store.active)
        .then(response => {
            return this.saveAssets();
        }).then(() => {
            this.load();
        });
    }

    createFilters(cells) {
        for(let i in cells) {
            if (cells[i].type == "asset") continue;
            this._store.filters[i] = { value : null, matchMode: FilterMatchMode.EQUALS }
        }
    }

    resort() {

    }

    getReference(field) {
        if (!this._refs[field]) {
            return this.load()
            .then(() => {
                let params = {};
                if (this._store.route.parent) {
                    const parent_model = this._store.route.parent;
                    params["--parentid"] = (this._params["--parentid"]) ? this._params["--parentid"] : this._store.slug_trail[parent_model]["--id"];
                }
                this._refs[field] = getReference(this._model, field, params);
            })
            .then(() => {
                return this._refs[field].load();
            });
        } else {
            return this._refs[field].load();
        }
    }

    rowToTree(obj, parent) {

        function walkObjTreeBuild(obj, links) {
            for(let i =0; i<links.length; ++i) {
                if (!obj[links[i]]) obj[links[i]] = {};
                obj = obj[links[i]];
            }
            return obj;
        }

        let nobj = {};
        nobj[parent] = {};
        for(let i in obj) {
            if (i.indexOf("/") > -1) {
                const pts = i.split("/");
                const name = pts.pop();
                const cobj = walkObjTreeBuild(nobj, pts);
                cobj[name] = obj[i];
            } else {
                nobj[parent][i] = obj[i];
            }
        }
        return nobj;
    }

    loadSlugTrail() {
        return getRoute(this._model)
        .then(route => {
            if (route.parent) {
                const id = (this._store.active["--id"]) ? this._store.active["--parentid"] : this._params["--parentid"];
                return Client.get("/data/" + route.parent + "/primary?__to=*&--id=" + id)
                .then(response => {
                    this._store.slug_trail = this.rowToTree(response, route.parent);
                    return this._store.slug_trail;
                }).catch(e => console.log(e));
            } else {
                return this._store.slug_trail;
            }
        });
    }
    
}

let cache = {};


//need to add in search params and data settings



export function createStore(model, params = {}) {
    cache[model] = new DataStore(model, params);
    return cache[model];
};


export function getDataStoreById(id) {
    return cache[id];
}

export function getStoreById(id) {
    return cache[id].store;
}

export function clearDataCache() {
    cache = {};
}

export function hasStore(id) {
    return (cache[id]) ? true : false;
}
