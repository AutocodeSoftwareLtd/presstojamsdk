<template>
    <h3>Reports For {{ group }}</h3>
    <NumericReport v-for="field in numeric_reports" :group="group" :field="field" :key="field" />
    <SummaryReport :group="group" />   
</template>
<script setup>
import { getModel } from "../../js/models/modelstore.js"
import NumericReport from "./numeric-report.vue"
import SummaryReport from "./summary-report.vue"
import { inject } from "vue"


const props = defineProps({
    group : String
});

const model = inject("model");

const store = getModel(model);
const schema = store.route.schema;

const numeric_reports = [];
for(const field in schema) {
    if (schema[field].type == "number") {
        numeric_reports.push(field);
    }
}


</script>