<template>
    <div>
    <div v-for="obj in report_models" :key="obj.name">
        <h2>Reports For {{$t("models." + obj.name + ".title", 1) }}</h2>
        <report-display  :schema="obj" /> 
    </div>
    </div>
</template>
<script setup>
import { getRoot, getEntities } from "../../js/entity/entitymanager.js"
import ReportDisplay from "./report-display.vue"


const props = defineProps({
    model : String
});

const entities = getEntities();

const report_models = [];

for(let i in entities) {
    const entity = entities[i];
    const parent = getRoot(entity);
    if (parent.name == props.model) {
        const obj = {name : entity.name, numeric : []};
        for(const field in entity.cells) {
            if (entity.cells[field].type == "number") {
                obj.numeric.push(field);
            }
        }
        report_models.push(obj);
    }
}

</script>