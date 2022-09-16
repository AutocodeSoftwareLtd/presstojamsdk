import Client from "./client.js"
import { reactive, ref } from "vue"
import { getRoute, getRouteStructure } from "./routes.js"
import { rowToTree, commonParent } from "./helperfunctions.js"


function loadCount(store) {
    if (store.route.settings.limit && !store.active.value['--id']) {
        return Client.get("/count/" + store.model, buildParams(store))
        .then(response => {
            store.pagination.count = parseInt(response.count);
            store.pagination.rows_per_page = store.route.settings.limit;
        });
    } else {
        return Promise.resolve(true);
    }
}


function loadStore(store) {
    if (!store.load_promise) {
        store.load_promise = loadCount(store)
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
        })
        .catch(e => console.log(e));
    }
    return store.load_promise;
}

function create(model) {

    const store = {
        init_promise : null,
        load_promise : null,
        index : {},
        params : {},
        model : model,
        getParentID() {
            return (!store.parent_store || !store.parent_store.active.value['--id']) ? 0 : store.parent_store.active.value['--id']; 
        },
        data : ref([]),
        route : getRoute(model),
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
        load() {
            if (!this.load_promise) {
                this._load_promise = loadStore(this);
            }
            return this.load_promise;
        },
        reload() {
            this.load_promise = null;
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
                this.index[obj['--id']] = this.data.value.length;
                this.data.value.push(obj);
            } else {
                const index = this.index[obj['--id']];
                for(let i in obj) {
                    this.data.value[index][i] = obj[i];
                }
            }
        }
    }

    const schema =store.route.schema;
    for(let i in schema) {
        if (schema[i].type == "id" && schema[i].isReferenceType()) {
            store.references[i] = createRefStore(
                model, 
                i, 
                schema[i].reference,
                store
            );
            let struc = getRouteStructure(model);
            let struc1 = getRouteStructure(store.references[i].model);
            store.references[i].common_parent = commonParent(struc, struc1);
        }
    }

    return store;
}

function createRefStore(model, field, reference_to, ref_store) {
    const store = {
        model : model,
        field : field,
        reference : reference_to,
        load_promise : null,
        route : getRoute(model),
        common_parent : null,
        commonParentID() {
            return ref_store.getParentID();
        },
        load() {
            if (!this.load_promise) {
                let params = {};
                let id = this.commonParentID();
                if (id) params["--id"] = id;
                this.load_promise = Client.get("/reference/" + model + "/" + field, params);
            }
            return this.load_promise;
        },
        reload() {
            this.load_promise = null;
            return this.load();
        }
    }
    return store;
}


export function createDataStore(model) {

    cache[model] = create(model);
    return cache[model];
}

export function createTemporaryStore(model) {
    return create(model);
}




export function loadSlugTrail(store) {
    if (store.route.parent) {
        const id = (store.active.value['--id']) ? store.active.value["--parent"] : store.parentid.value;
        return Client.get("/data/" + store.route.parent + "/primary?__to=*&--id=" + id)
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
    const settings = ["to", "fields", "order"];
    for(const setting of settings) {
        if (store.route.settings[setting]) params['__' + setting] = store.route.settings[setting]
        else if (store.params[setting]) params['__' + setting] = store.params[setting]
    }
    return params;
}



let cache = {};


//need to add in search params and data settings

export function getStoreById(id) {
    if (!cache[id]) {
        console.log(cache);
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
