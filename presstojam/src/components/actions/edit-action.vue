<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
</template>
<script setup>
    import EditEffect from "../effects/edit-effect.vue"
    import Button from "primevue/button"
    import { toggleDialog } from "./../../js/bus/dialog.js"
 

    const props = defineProps({
        model : Object,
        data : Object
    });



    function editRow() {
        toggleDialog(EditEffect, {
            model : props.model,
            data : props.data
        });
    }

</script>