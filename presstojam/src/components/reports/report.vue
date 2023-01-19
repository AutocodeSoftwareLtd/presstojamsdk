<template>
    <ReportGroup group="all" />
    <ReportGroup v-for="group in groups" :key="group" :group="group" />
</template>
<script setup>
import { getModel, clearModelCache } from "../../js/models/modelmanager.js"
import ReportGroup from "./report-group.vue"
import { provide, inject } from "vue"
import { ReferenceTypes } from "../../js/entity/id";

const props = defineProps({
    model : String,
    id : String,
    atts : Object
});

provide("model", props.model);


clearModelCache();
const store = getModel(props.model);

const groups = [];
for(const field_name in store.fields) {
    const field = store.fields[field_name];
    if (field.type == "id" && field.reference_type == ReferenceTypes.REFERENCE) {
        groups.push(field);
    } else if (field.type == "string" && field.isEnum()) {
        groups.push(field);
    }
}

</script>