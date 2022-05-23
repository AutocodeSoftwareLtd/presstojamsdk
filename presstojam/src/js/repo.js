import Settings from "./settings.js"
import { MetaRow } from "./metarow.js"
import { DataRow } from "./datarow.js"
import { Map } from "./route.js"
import { reactive } from "vue"
import client from "./client.js"

const settings = Settings.getModelSettings(Map.model, Map.state);
export const RepoStore = reactive({meta : new MetaRow, data : [], indexes : {}, search : new DataRow() });

if (settings.fields) RepoStore.meta.limited_fields = settings.fields;

function mapSearchData() {

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


export const loadRepo = async() => {
    let params = { ...RepoStore.meta.convertToParams(), ...RepoStore.search.convertToParams() };
    RepoStore.meta = new MetaRow();
    RepoStore.data = [];
    RepoStore.indexes = {};
    RepoStore.search = new DataRow();
    if (!params) params = {};
    if (Map.to) params.__to = Map.to;
    if (Map.key) params["--parentid"] = Map.key;
    if (settings.fields) params.__fields = settings.fields;
    let url = "/" + Map.route + "/" + Map.model;
    if (Map.state == "parent") url += "/parent";
    return client.get("/route" +url, params)
    .then(response => {
        RepoStore.meta.map(response.fields, settings.fields);
        RepoStore.meta.applyMap(Map);
        RepoStore.meta.applyMap(settings);
        RepoStore.search.applyMetaRow(RepoStore.meta);
        RepoStore.search.row = Map.params;
        RepoStore.meta.init = true;
    }).then(() => {
        params = { ...params, ...RepoStore.search.convertToAPIParams()};
        if (RepoStore.meta.limit > 0) {
            return client.get("/data" + url + "/count", params)
            .then(response => {
                RepoStore.meta.count = response.count;
                RepoStore.meta.max_pages = Math.ceil(response.count / RepoStore.meta.limit);
            })
            .then(() => {
                return client.get("/data" + url, params);
            })
            .then(response => {
                mapRepoData(response);
                if (RepoStore.meta.store.index) indexData();
                return response;
            });
        } else {
            return client.get("/data" + url, params)
            .then(response => {
                mapRepoData(response);
                if (RepoStore.meta.store.index) indexData();
                return response;
            });
        }
    })
    .catch(e => console.log(e));
}
