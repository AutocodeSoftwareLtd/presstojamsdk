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

import PtjFilter from "./filter.vue"
import { computed, provide } from "vue"
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset';

const props = defineProps({
    store : Object
});

provide("model", props.store.model);

const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in props.store.route.schema) {
        if (props.store.route.schema[i].background) continue;
        if (props.store.route.schema[i].type == "asset" || props.store.route.schema[i].type == "json") continue;
        filter_cells[i] = props.store.route.schema[i];
    }
    return filter_cells;
});


function submit() {
    props.store.reload();
}
</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>