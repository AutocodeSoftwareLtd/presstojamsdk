<template>
    <DataTable />
    
</template>
<script setup>
import DataTable from "primevue/DataTable"
import { inject } from "vue"
import { getStoreById } from "../../js/datastore.js"
import { createRepoStore } from "../../js/reactivestores.js"

const props = defineProps({
    group : String
});

const model = inject("model");

const store = getStoreById(model);
const repo = createRepoStore(store);

</script>