<template>
    <ReportGroup group="all" />
    <ReportGroup v-for="group in groups" :key="group" :group="group" />
</template>
<script setup>
import { createDataStore, clearDataCache } from "../../js/datastore.js"
import ReportGroup from "./report-group.vue"
import { provide, inject } from "vue"
import { ReferenceTypes } from "../../js/meta/id";

const props = defineProps({
    model : String,
    id : String,
    atts : Object
});

provide("model", props.model);

const client = inject("client");

clearDataCache();
const store = createDataStore(client, props.model);
const schema = store.route.schema;

const groups = [];
for(const field in schema) {
    if (schema[field].type == "id" && schema[field].reference_type == ReferenceTypes.REFERENCE) {
        groups.push(field);
    } else if (schema[field].type == "string" && schema[field].isEnum()) {
        groups.push(field);
    }
}

</script>