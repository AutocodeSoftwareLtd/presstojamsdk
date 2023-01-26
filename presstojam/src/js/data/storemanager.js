import { reactive, ref } from "vue"
import { getLabel } from "../helperfunctions";
import { RepoData } from "./repodata.js"
import { ActiveData } from "./activedata.js" 
import { ReportStore } from "./reportdata.js"

let stores = {};



export function createRepoStore(store) {
    return new RepoData(store);
}



export function createActiveStore(store, active_id) {
    return new ActiveData(store, active_id);
}


export function createReportStore(store) {
    return new ReportStore(store);
}

export function createFirstStore(store) {
    store.limit = 1;
    store.order = ["--id", "ASC"];
    return new RepoData(store);
    /*return {
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
    }*/
}


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


export function hasStore(name) {
    return (stores[name]) ? true : false;
}