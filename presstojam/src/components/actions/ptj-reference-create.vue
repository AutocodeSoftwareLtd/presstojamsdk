<template>
    <Button icon="pi pi-plus" class="p-button-rounded p-button-success mr-2" @click="createReference" />
    <Dialog v-model:visible="dialog" :header="'Create ' + $t('models.' + cref.reference + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-form :store="referencestore" @saved="onCreate" :parent="parent" :common_parent="common_parent" :common_parent_id="common_parent_id"/>
    </Dialog>
 </template>
 <script setup>
     import Button from "primevue/Button"
     import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
     import { ref } from "vue"
     import { createTemporaryStore} from "./../../js/datastore.js"
 
     const props = defineProps({
         cref : Object
     });

   
     const emits = defineEmits(['onCreate']);

     const dialog = ref(false);

    
    
    const referencestore = createTemporaryStore(props.cref.reference);
    let parent = false;
    let common_parent = "";
    let common_parent_id = 0;

  
    if  (props.cref.common_parent && props.cref.common_parent != referencestore.route.parent) {
        parent = true;
        common_parent = props.cref.common_parent;
        common_parent_id = props.cref.commonParentID();
    }
 
    function createReference() {
        referencestore.active.value = {};
        if (!parent && referencestore.route.parent) {
            referencestore.active.value['--parentid'] = props.cref.commonParentID();
        }
        dialog.value =true;
    }

    function onCreate() {
        dialog.value = false;
        console.log("Active is", referencestore.active.value);
        emits('onCreate', referencestore.active.value['--id']);
    }
 </script>