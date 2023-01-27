<template>
    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="createRow" />
   
</template>
<script setup>
    import Button from "primevue/button"
    import { trigger } from "./../../js/bus/bus.js"
    import CreateEffect from "./../effects/create-effect.vue"
    import { inject } from "vue"

    const props = defineProps({
       name : String,
       id : {
        type : Number,
        default : 0
       },
       model : Object
    });

    const i18n = inject("i18n");
    const t = i18n.t;

 
    const header = (props.model.parent) 
        ? "Add " + t("models." + props.model.name + ".title", 1) + " to " + t("models." + props.model.parent + ".title", 1)
        : "Create " + t("models." + props.model.name + ".title", 1);

    const data = {};
    if (props.parent_id) data["--parent"] = props.parent_id;

    function createRow() {
      trigger("dialog_open",
        CreateEffect, 
        {
            name : props.name,
            id : props.id
        }, 
        header);
    }
    
 
</script>