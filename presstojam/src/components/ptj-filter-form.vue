<template>
    <ptj-filter 
        class="ptj-filter" 
        v-for="field in filtercells" :field="field" :key="field.name" />
</template>
<script setup>

import PtjFilter from "./ptj-filter.vue"
import { computed, inject } from "vue"
import { getDataStoreById } from "./../js/datastore.js"

const model = inject("model");

const data_store = getDataStoreById(model);

const store =data_store.store;

    
const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in store.route.schema) {
        if (store.route.schema[i].background) continue;
        if (store.route.schema[i].constructor.name == "Asset") continue;
        filter_cells[i] = store.route.schema[i];
    }
    return filter_cells;
});

</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>