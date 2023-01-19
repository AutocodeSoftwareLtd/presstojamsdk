<template>
    <DataTable />
    
</template>
<script setup>
import DataTable from "primevue/DataTable"
import { inject } from "vue"
import { getModel } from "../../js/models/modelstore.js"
import { createRepoStore } from "../../js/reactivestores.js"

const props = defineProps({
    group : String
});

const model = inject("model");

const store = getModel(model);
const repo = createRepoStore(store);

</script>