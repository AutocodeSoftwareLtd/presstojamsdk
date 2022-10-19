<template>
    <Button icon="pi pi-plus" class="p-button-rounded p-button-success mr-2" @click="createReference" />
    <Dialog v-model:visible="dialog" :header="'Create ' + $t('models.' + cell.reference + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-form :store="referencestore" @saved="onCreate" :parent="parent" :common_parent="cell.common" :common_parent_id="common_parent_id"/>
    </Dialog>
 </template>
 <script setup>
    import Button from "primevue/Button"
    import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
    import { ref, inject } from "vue"
    import { ReferenceTypes } from "./../../js/meta/id.js"
    import { createTemporaryStore } from "./../../js/datastore.js"

 
     const props = defineProps({
         cell : Object,
         store : Object
     });

   
     const client = inject("client");

     const emits = defineEmits(['onCreate']);

     const dialog = ref(false);

    
    
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