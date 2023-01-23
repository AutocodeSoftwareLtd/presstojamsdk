<template>
    <Button label="Export" icon="pi pi-external-link" class="p-button-help mr-2"  @click="exportCSV(name)" />
</template>
<script setup>
import Button from "primevue/button"
import { exportCSV } from "./../../js/exports/exportcsv.js"


const props = defineProps({
    name : String
});

</script>