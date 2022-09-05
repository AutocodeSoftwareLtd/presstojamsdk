<template>
    <Button label="Export" icon="pi pi-external-link" class="p-button-help"  @click="exportCSV" />
</template>
<script setup>
import Button from "primevue/Button"
const props = defineProps({
    table : Object
});

function exportCSV() {
    props.table.exportCSV();
}

</script>