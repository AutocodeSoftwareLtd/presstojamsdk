<template>
    <Fieldset :toggleable="true" :collapsed="true">
        <template #legend>
            <i class="pi pi-filter"></i> Filters
        </template>
        <span class="p-buttonset">
    <ptj-filter 
        class="ptj-filter" 
        v-for="field in filtercells" :bind="field" :key="field.name" />
        </span>
        <p style="text-align:right">
        <Button :label="$t('btns.filter')" @click="submit" />
        </p>

    </Fieldset>
</template>
<script setup>

import PtjFilter from "./filter.vue"
import { computed, provide, ref } from "vue"
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset';
import { Bind } from "./../../js/binds/bind.js"

const props = defineProps({
    model : Object,
    data : Object,
    name : String
});

provide("model", props.model.name);


const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in props.model.fields) {
        const field = props.model.fields[i];
        if (field.background) continue;
        if (field.type == "asset" || field.type == "json") continue;
        filter_cells[i] = new Bind(field, props.data[i]);
    }
    return filter_cells;
});


function submit() {
    const filters = {};
    for(let i in filter_cells) {
        filters[i] = filter_cells[i].value;
    }
    trigger("filter_form", props.name, filters);
}
</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>