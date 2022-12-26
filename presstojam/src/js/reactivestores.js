import { reactive, ref } from "vue"
import { getLabel } from "../js/helperfunctions";

let stores = {};

export function clearStores() {
    stores = {};
}

export function regStore(name, store) {
    stores[name] = store;
}


export function getStore(name) {
    if (!stores[name]) {
        throw "Can't get reactive store of " + name;
    }
    return stores[name];
}

export function createRepoStore(store) {
    const obj = {
        parent_id : ref(store.parent_id),
        store : store,
        active : ref({}),
        selected : ref([]),
        is_loading : ref(false),
        data : ref([]),
        load_promise : null,
        key : new Date().getTime()
    };

    obj.serve = function(response) {
            this.data.value = response;
            this.is_loading.value = false;
    };

    obj.load = function() {
        if (!this.load_promise) {
            this.is_loading.value = true;
            let promise;
            if (store.limit) {
                promise = this.load_promise = store.loadCount()
                .then(count => {
                    this.pagination.count = count;
                    return store.load();
                });
            } else {
                promise = store.load();
            }
                
            this.load_promise = promise
            .then(response => {
                this.serve(response);
            })
            .catch(e => {
                console.log(e);
                this.is_loading.value = false;
                throw e;
            });
        }
        return this.load_promise;
    };


    obj.reload = function() {
        this.store.reset();
        this.selected.value = [];
        this.active.value = {};
        this.load_promise = null;
        return this.load();
    }

    obj.overwrite = function(obj) {
        for(let row of this.data.value) {
            if (row['--id'] == obj['--id']) {
                for(let x in obj) {
                    row[x] = obj[x];
                }
            } 
        }
    } 


    if (store.limit) {
        obj.pagination = reactive({ rows_per_page : store.limit, count : 0, offset : 0 }),
        obj.paginate = function() {
            this.is_loading.value = true;
            store.page_offset = this.pagination.offset;
            store.reload()
            .then(response => {
                this.serve(response);
            })
            .catch(e => {
                console.log(e);
                this.is_loading.value = false;
            });
        }
    }

    return obj;
}



export function createActiveStore(store) {
    return {
        parent_id : ref(0),
        store : store,
        active_id : store.active_id,
        is_loading : ref(false),
        selected : ref([]),
        data : ref({}),
        label : ref(''),
        load() {
            return store.load()
            .then(response => {
                this.data.value = response;
                if (this.data.value['--parentid']) this.parent_id.value = this.data.value['--parentid'];
                this.is_loading.value = false;
                this.label.value = getLabel(store.route.schema, this.data.value);
            })
            .catch(e => {
                console.log(e);
                this.is_loading.value = false;
            });
        },
        overwrite(obj) {
            for(let x in obj) {
                this.data.value[x] = obj[x];
            }
        } 
    }
}


export function createFirstStore(store) {
    return {
        parent_id : ref(0),
        store : store,
        active_id : 0,
        is_loading : ref(false),
        selected : ref([]),
        data : ref({}),
        label : ref(''),
        load_promise : null,
        load() {
            this.is_loading.value = true;
            this.load_promise = store.loadFirst()
            .then(() => {
                return store.load();
            }).then(response => {
                this.data.value = response;
                if (this.data.value['--parentid']) this.parent_id.value = this.data.value['--parentid'];
                this.label.value = getLabel(store.route.schema, this.data.value);
                this.is_loading.value = false;
            })
            .catch(e => {
                console.log(e);
                this.is_loading.value = false;
            });
        },
        overwrite(obj) {
            for(let x in obj) {
                this.data.value[x] = obj[x];
            }
        } 
    }
}


