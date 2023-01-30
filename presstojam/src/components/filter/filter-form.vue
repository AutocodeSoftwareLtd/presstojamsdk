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
    </Fieldset>
</template>
<script setup>

import PtjFilter from "./filter.vue"
import { provide } from "vue"
import Fieldset from 'primevue/fieldset';
import { Bind } from "./../../js/binds/bind.js"

const props = defineProps({
    repo : {
        type : Object,
        required : true
    },
    name : String
});

const model = props.repo.model;

provide("model", model);
provide("repo", props.repo);

const fields = model.getEnabledCells();
const filtercells = {};

for(const i in fields) {
    const field = fields[i];
    if (i == "--owner" || i == "--sort" || i== "--parent" || field.type == "asset" || field.type == "json" || field.encrypted) continue;
    filtercells[i] = new Bind(field);
}


</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>