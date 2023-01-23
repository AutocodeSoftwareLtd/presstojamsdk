<template>

    <Button icon="pi pi-upload" class="mr-2" @click="toggleImport">Import</Button>
</template>
<script setup>
    import Button from "primevue/button"
    import PtjImport from "./../import/import.vue"
    import { trigger } from "./../../js/bus/bus.js"


    const props = defineProps({
        name : String
    });


    function toggleImport() {
        trigger(
            "dialog_open",
            PtjImport, 
            {
                name : props.name,
            },
            "Import"
        );
    }
</script>