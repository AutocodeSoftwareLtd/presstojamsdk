<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
</template>
<script setup>
    import EditEffect from "../effects/edit-effect.vue"
    import Button from "primevue/button"
    import { trigger } from "./../../js/bus/bus.js"
    import { inject } from "vue"
 

    const props = defineProps({
        id : {
            type : Number,
            default : 0
        },
        name : String,
        model : Object
    });

    const i18n = inject("i18n");
    const t = i18n.t;

    const header = "Edit " + t("models." + props.model.name + ".title", 1);


    function editRow() {
        trigger(
            "dialog_open",
            EditEffect, 
            {
                id : props.id,
                name : props.name
            },
            header
        );
    }

</script>