<template>
    <i class="pi pi-plus" @click="createReference" style="cursor:pointer;"></i>
 </template>
 <script setup>
    
    import { inject } from "vue"
    import { trigger } from "./../../js/bus/bus.js"
    import ReferenceEffect from "./../effects/reference-effect.vue"

    const props = defineProps({
       name : String
    });
 
    const i18n = inject("i18n");
    const t = i18n.t;

 
    const header = "Create " + t("models." + props.name + ".title", 1);

   
    function createReference() {
      trigger("dialog_open",
        ReferenceEffect, 
        {
            name : props.name
        }, 
        header);
    }
 </script>