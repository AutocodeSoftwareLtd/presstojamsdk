<template>
  <div :class="[map.model, map.state]">
    <button @click="toggleCreate()">Create</button>
    <ptj-modal :active="show_create" @close="toggleCreate()">
        <ptj-form state="post" :data="post_data" @complete="load" />
    </ptj-modal>
    <ptj-filter-form  v-if="settings.disable_filter != true" @reload="load" :meta="meta" />
    <ptj-selectfields v-if="settings.disable_selectfields != true" />
    <ptj-tree v-if="component=='tree'" />
    <ptj-list v-else-if="component=='list'" />
    <ptj-table v-else />
    <ptj-pagination v-if="meta.limit > 0" />
  </div>
</template>

<script setup>

import { reactive, ref, inject, provide } from "vue"
import { DataRow } from "./../js/datarow.js"
import client from "./../js/client.js"
import PtjTree from "./ptj-tree.vue"
import PtjTable from "./ptj-table.vue"
import PtjList from "./ptj-list.vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjSelectfields from "./ptj-selectfields.vue"
import PtjPagination from "./ptj-pagination.vue"
import Settings from "./../js/settings.js"
import PtjModal from "./ptj-modal.vue"
import PtjForm from "./ptj-form.vue"


const map = inject("map");
const meta = inject("meta");
const settings = Settings.getModelSettings(map.model, map.state);
const show_create = ref(false);

const post_data = reactive(new DataRow(meta));


let data = ref([]);
const indexes = reactive({});
provide("data", data);
provide("indexes", indexes);

const component = (settings.component) ? settings.component : (meta.index || meta.children.length > 0) ? "tree" : "table";

function toggleCreate() {
    show_create.value = (show_create.value) ? false : true;
}

function indexData() {
    for(const i in indexes) {
        delete indexes[i];
    }
    
    for(const key in data.value) {
        const row = data.value[key];
        let ckey = row.getCell(meta.index).toVal();
        if (!indexes[ckey]) indexes[ckey] = [];
        indexes[ckey].push(key);
    }
}


function mapRepoData(response) {
    data.value = [];
    for (const i in response.__data) {
        let obj= new DataRow(meta);
        obj.row = response.__data[i];
        data.value.push(obj);
    }
}


const load = async() => {
    let params = meta.convertToAPIParams(map.state);
    if (!params) params = {};
    if (map.to) params.__to = map.to;
    if (map.key) params.__key = map.key;

    let url = "/" + map.model;
    if (map.state == "parent") url += "-parent"; 
    if (meta.limit > 0) {
        return client.get(url + "-count", params)
        .then(response => {
            meta.count = response.count;
            meta.max_pages = Math.ceil(response.count / meta.limit);
        })
        .then(() => {
            return client.get(url, params);
        })
        .then(response => {
            if (response.__status != "SUCCESS") throw new Error(response);
            mapRepoData(response);
            if (meta.index) indexData();
            return response;
        });
    } else {
        return client.get(url, params)
        .then(response => {
            if (response.__status != "SUCCESS") throw new Error(response);
            mapRepoData(response);
            if (meta.index) indexData();
            return response;
        });
    }
}


load();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}


</style>