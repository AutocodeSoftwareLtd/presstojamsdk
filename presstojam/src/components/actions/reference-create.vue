<template>
    <ptj-form :store="referencestore" @saved="onCreate" :parent="parent" :common_parent="cell.common" :common_parent_id="common_parent_id"/>
 </template>
 <script setup>
    
    import { inject } from "vue"
    import { ReferenceTypes } from "../../js/meta/id.js"
    import { createTemporaryStore } from "../../js/datastore.js"
    import PtjForm from "../form/form.vue"

 
     const props = defineProps({
         cell : Object,
         store : Object
     });

   
     const client = inject("client");

     const emits = defineEmits(['onCreate']);

     

    
    
    const referencestore = createTemporaryStore(client, props.cell.reference);
    let parent = false;
    let common_parent = "";
    let common_parent_id = 0;

  
    if  (props.cell.common && props.cell.reference_type != ReferenceTypes.CIRCULAR) {
        parent = true;
        common_parent = props.cell.common;
        common_parent_id = props.store.slug_trail.value[props.cell.common]['--id'];
    }
 
    function createReference() {
        referencestore.active.value = {};
        if (!parent && referencestore.route.parent) {
            referencestore.active.value['--parent'] = common_parent_id;
        }
        dialog.value =true;
    }

    function onCreate() {
        dialog.value = false;
        emits('onCreate', referencestore.active.value['--id']);
    }
 </script>