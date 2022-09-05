<template>
    <Fieldset :toggleable="true" :collapsed="true">
        <template #legend>
            <i class="pi pi-filter"></i> Filters
        </template>
        <span class="p-buttonset">
    <ptj-filter 
        class="ptj-filter" 
        v-for="field in filtercells" :field="field" :key="field.name" />
        </span>
        <p style="text-align:right">
        <Button :label="$t('btns.filter')" @click="submit" />
        </p>

    </Fieldset>
</template>
<script setup>

import PtjFilter from "./ptj-filter.vue"
import { computed, provide } from "vue"
import { getDataStoreById } from "./../js/datastore.js"
import Button from 'primevue/Button'
import Fieldset from 'primevue/fieldset';

const props = defineProps({
    model : String,
    store : Object
});

provide("model", props.model);

const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in props.store.route.schema) {
        if (props.store.route.schema[i].background) continue;
        if (props.store.route.schema[i].constructor.name == "Asset") continue;
        else if (props.store.route.schema[i].states.length) continue;
        filter_cells[i] = props.store.route.schema[i];
    }
    return filter_cells;
});


function submit() {
    const store = getDataStoreById(props.model);
    store.reload();
}
</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>