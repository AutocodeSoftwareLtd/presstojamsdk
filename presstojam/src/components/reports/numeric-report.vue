<template>
    <Menubar>
        <template #start>
            <AggregateType :report="report" />
            <Scales :report="report" v-if="report.has_scale" />
        </template>
        <template #end> 
            <Overlays :report="report" />
        </template>
    </Menubar>
    <Chart v-if="report.has_scale" type="line"/>
    <Chart v-else type="bar" />
</template>
<script setup>

import { inject } from "vue"
import { getModel } from "../../js/models/modelmanager.js"
import { createRepoStore } from "../../js/data/storemanager.js"
import Overlays from "./overlays.vue"
import Scales from "./scales.vue"
import AggregateType from "./aggregate-type.vue"
import Menubar from 'primevue/menubar';
import Chart from 'primevue/chart';

const props = defineProps({
    group : String,
    field : String,
    report : Object
});

const model = inject("model");

const store = getModel(model);
const repo = createRepoStore(store);

const schema = store.fields;

const x_axes = [];

for(const field in schema) {
    if (schema[field].type == "time" || schema[field].type == "number") {
        x_axes.push(field);
    }
}

</script>