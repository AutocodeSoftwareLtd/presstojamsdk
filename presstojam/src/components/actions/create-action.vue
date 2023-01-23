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
       parent: String
    });

    const i18n = inject("i18n");
    const t = i18n.t;

    const header = (props.parent) 
        ? "Add " + t("models." + props.name + ".title", 1) + " to " + t("models." + props.parent + ".title", 1)
        : "Create " + t("models." + props.name + ".title", 1);


    function createRow() {
      trigger("dialog_open",
        CreateEffect, 
        {
            name : props.name,
        }, 
        header);
    }
    
 
</script>