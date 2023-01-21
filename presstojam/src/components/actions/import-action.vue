<template>

    <Button icon="pi pi-upload" class="mr-2" @click="toggleImport">Import</Button>
</template>
<script setup>
    import Button from "primevue/button"
    import PtjImport from "./../import/import.vue"
    import { toggleDialog } from "./../../js/bus/dialog.js"


    const props = defineProps({
        name : String
    });


    function toggleImport() {
        toggleDialog(PtjImport, {
            name : props.name,
        });
    }
</script>