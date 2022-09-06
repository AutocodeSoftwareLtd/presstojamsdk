<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="createReference" />
    <Dialog v-model:visible="dialog" :style="{width: '450px'}" :header="model" :modal="true" class="p-fluid">
        <ptj-form :model="model" :store="referencestore" @saved="onCreate" />
    </Dialog>
 </template>
 <script setup>
     import Button from "primevue/Button"
     import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
     import { ref } from "vue"
     import { getStoreById, hasStore, createDataStore} from "./../../js/datastore.js"
 
     const props = defineProps({
         model : String,
         id : Number
     });

     const emits = defineEmits(['onCreate']);

     const dialog = ref(false);
     

    const referencestore = (!hasStore(props.model)) ? createDataStore(props.model) : getStoreById(props.model);
    referencestore.setParams({ "--parentid" : props.id });

    function createReference() {

        referencestore.active.value = { };
        dialog.value =true;
    }

    function onCreate() {
        dialog.value = false;
        console.log("Active is", referencestore.active.value);
        emits('onCreate', referencestore.active.value['--id']);
    }
 </script>