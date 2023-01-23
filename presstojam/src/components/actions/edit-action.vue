<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
</template>
<script setup>
    import EditEffect from "../effects/edit-effect.vue"
    import Button from "primevue/button"
    import { trigger } from "./../../js/bus/bus.js"
 

    const props = defineProps({
        model : Object,
        data : Object
    });



    function editRow() {
        trigger(
            "dialog_open",
            EditEffect, 
            {
                model : props.model,
                data : props.data
            },
            "Edit"
        );
    }

</script>