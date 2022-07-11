import { MetaRow } from "./metarow.js"
import { DataRow } from "./datarow.js"
import { Map } from "./map.js"
import { reactive } from "vue"
import client from "./client.js"
import { getModelSettings } from "./route.js" 


export const RepoStore = reactive({meta : new MetaRow, data : [], indexes : {}, search : new DataRow() });

export function applySettings(settings) {
    meta_settings = settings;
}

function indexData() {
    RepoStore.indexes = {};
    
    for(const key in RepoStore.data) {
        const row = RepoStore.data[key];
        let ckey = row.cells[RepoStore.meta.store.index].val;
        if (!RepoStore.indexes[ckey]) RepoStore.indexes[ckey] = [];
        RepoStore.indexes[ckey].push(key);
    }
}


function mapRepoData(response) {
    RepoStore.data = [];
    for (const i in response) {
        let obj= new DataRow(RepoStore.meta);
        obj.row = response[i];
        RepoStore.data.push(obj);
    }
}


function buildParams(meta_settings) {
    let params = {};
    if (!params) params = {};
    if (Map.to) params.__to = Map.to;
    if (meta_settings.to) params.__to = meta_settings.to;
    if (Map.key) params["--parentid"] = Map.key;
    if (meta_settings.limit) params.__limit = meta_settings.limit;
    if (meta_settings.fields) params.__fields = meta_settings.fields;
    if (meta_settings.group) params.group = meta_settings.group;
    if (Map.params._page) params.__limit = ((Map.params._page - 1) * params.__limit) + "," + params.__limit;
    return params;
}

export function resetRepo() {
    RepoStore.meta = new MetaRow();
    RepoStore.data = [];
    RepoStore.indexes = {};
    RepoStore.search = new DataRow();
    RepoStore.max_pages = 0;
}


export const loadRepo = async() => {
    let meta_settings = getModelSettings();
    
    resetRepo();
    let params = buildParams(meta_settings);
    let url = Map.model;
    if (Map.state == "parent") url += "/parent";
    return client.get("/meta/" +url, params)
    .then(response => {
        RepoStore.meta.map(response.fields, meta_settings.fields);
        if (meta_settings.show == 'all') {
            RepoStore.meta.showAll();
        }

        RepoStore.search.applyMetaRow(RepoStore.meta);
        RepoStore.search.setMode("filter");
        RepoStore.search.filter = Map.params;
        RepoStore.meta.init = true;

        if (meta_settings.component) RepoStore.component = meta_settings.component;
        else if (!RepoStore.meta.cells) RepoStore.component = "";
        else RepoStore.component = (RepoStore.meta.store.index || RepoStore.meta.children.length > 0) ? "tree" : "table";
    }).then(() => {
        params = { ...params, ...RepoStore.search.convertToAPIParams()};
        if (meta_settings.limit > 0) {
            return client.get("/count/" + url, params)
            .then(response => {
                RepoStore.max_pages = Math.ceil(response.count / meta_settings.limit);
            })
            .then(() => {
                return client.get("/data/" + url, params);
            })
            .then(response => {
                mapRepoData(response);
                if (RepoStore.meta.store.index) indexData();
                return response;
            });
        } else {
            return client.get("/data/" + url, params)
            .then(response => {
                mapRepoData(response);
                if (RepoStore.meta.store.index) indexData();
                return response;
            });
        }
    })
    .catch(e => console.log(e));
}


export function reorderRepo(positions) {
    const arr = [];
    arr.length = RepoStore.data.length;
    for(let i in RepoStore.data) {
        arr[positions[RepoStore.data[i].primary] - 1] = RepoStore.data[i];
    }
    RepoStore.data = arr;
}
