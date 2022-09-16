<template>
    <Button label="Export" icon="pi pi-external-link" class="p-button-help"  @click="exportCSV" />
</template>
<script setup>
import Button from "primevue/Button"
const props = defineProps({
    store : Object
});

const data = props.store.data.value;
const cells = props.store.route.schema;
const settings = props.store.route.settings;


function exportCSV() {



}

</script>