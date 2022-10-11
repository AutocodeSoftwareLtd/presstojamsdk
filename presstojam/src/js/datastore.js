import Client from "./client.js"
import { reactive, ref } from "vue"
import { getRoute, getRouteStructure, createView, createCustomStructure } from "./routes.js"
import { rowToTree, commonParent } from "./helperfunctions.js"




export function loadAll(store) {
    let params = buildParams(store);
    delete params.__limit;
    return Client.get("/data/" + store.model, params);
}


function loadCount(store) {
    if ((store.active.value && store.active.value['--id']) || store.route.settings.limit) {
        return Promise.resolve(true);
    } else {
        return Client.get("/count/" + store.model, buildParams(store))
        .then(response => {
            store.pagination.count = parseInt(response.count);
            store.pagination.rows_per_page = store.route.settings.limit;
        });
    }
}


function loadStore(store) {
    if (!store.load_promise) {
        store.is_loading = true;
        store.load_promise = store.loadCount()
        .then(() => {
            return Client.get("/data/" + store.model, buildParams(store))
        }).then(response => {
            store.index = {};
            store.data.value = [];
            for(let i in response) {
                store.index[response[i]['--id']] = i;
            }
      
            store.data.value = response;
            if (store.active.value['--id']) {
                store.active.value = store.data.value[store.index[store.active.value['--id']]];
            }
            store.is_loading = false;
        })
        .catch(e => console.log(e));
    }
    return store.load_promise;
}

function create(model) {

    const store = {
        count_promise : null,
        load_promise : null,
        index : {},
        params : {},
        model : model,
        getParentID() {
            return (!store.parent_store || !store.parent_store.active.value['--id']) ? 0 : store.parent_store.active.value['--id']; 
        },
        data : ref([]),
        route : createView(model),
        selected : ref(),
        active : ref({}),
        filters : ref({}),
        slug_trail : ref({}),
        parent_store : null,
        pagination : reactive({ rows_per_page : 0, count : 0, offset : 0 }),
        references : {},
        getDataById(id) {
            if (!this.index[id]) return null;
            return this.data.value[this.index[id]];
        },
        loadCount() {
            if (!this.count_promise) {
                this.count_promise = loadCount(this);
            }
            return this.count_promise;
        },
        load() {
            if (!this.load_promise) {
                this._load_promise = loadStore(this);
            }
            return this.load_promise;
        },
        reload() {
            this.load_promise = null;
            this.active.value = {};
            this.selected.value = null;
            return this.load();
        },
        setParams(params) {
            if (params['--id']) this.active.value = {'--id' : params['--id']};
            else if (params['--parent']) this.active.value = {'--parent' : params['--parent']};
        },
        overwrite(obj) {
            if (!obj['--id']) {
                throw "Can only overwrite store if object contains --id value";
            }
            
            if (this.index[obj['--id']] === undefined) {
                throw "Can't overwrite object of " + obj['--id'] + ", doesn't exist";
            }
                
            const index = this.index[obj['--id']];
            for(let i in obj) {
                this.data.value[index][i] = obj[i];
            }
        },
        append(obj) {
            this.index[obj['--id']]
            if (this.index[obj['--id']] !== undefined) {
                throw "Can't append row of " + obj['--id'] + ", already exists";
            }

            this.index[obj['--id']] = this.data.value.length;
            this.data.value.push(obj);
        },
        remove(id) {
            if (this.index[id] !== undefined) {
                const pos = this.index[id];
                this.data.value.splice(pos, 1);
                delete this.index[id];
            }
        }
    }

    const schema =store.route.schema;
    for(let i in schema) {
        if (schema[i].type == "id" && schema[i].isReferenceType()) {
            store.references[i] = createRefPromise(
                model, 
                i, 
                store
            );
        } 
    }

    return store;
}

function createRefPromise(model, field, store) {
    return {
        load_promise : null,
        load() {
            if (!this.load_promise) {
                let params = {};
                let url = "/reference/" + model + "/" + field;
                let id = 0;
                if (store.parent) id = store.getParentID();
                else id = store.active.value['--parent'];
                if (id) url += "/" + id;
                this.load_promise = Client.get(url, params);
            }
            return this.load_promise;
        },
        reload() {
            this.load_promise = null;
            return this.load();
        }
    }
}


export function createDataStore(model_name, parent = null) {

    const model = create(model_name);
    if (parent) model.parent_store = parent;
    cache[model_name] = model;
    return cache[model_name];
}

export function createTemporaryStore(model) {
    return create(model);
}




export function loadSlugTrail(store) {
    if (store.route.parent) { 
        const id = (store.active.value['--id']) ? store.active.value["--parent"] : store.getParentID();
        return Client.get("/data/" + store.route.parent + "/active?__to=*&--id=" + id)
        .then(response => {
            store.slug_trail.value = rowToTree(response, store.route.parent);
            for(let i in store.references) {
                const ref = store.references[i]
                if (ref.common_parent) {
                    ref.common_parent_id = store.slug_trail.value[ref.common_parent]['--id'];
                }
            }
        }).catch(e => console.log(e));
    } 
}



function buildParams(store) {
    let params = store.filters.value;
    let id = store.getParentID();
    if (id) params["--parent"] = id;
    if (store.pagination.rows_per_page) params.__limit = store.pagination.offset + "," + store.pagination.rows_per_page;
    const settings = ["to", "order"];
    for(const setting of settings) {
        if (store.route.settings[setting]) params['__' + setting] = store.route.settings[setting]
        else if (store.params[setting]) params['__' + setting] = store.params[setting]
    }

    if (store.route.settings.fields) {
        params["__fields"] = store.route.settings.fields;//createCustomStructure(store.route);
    }
    return params;
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
