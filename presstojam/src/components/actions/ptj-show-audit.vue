<template>
    <Button 
        :label="label" 
        icon="pi pi-history" 
        class="mr-2"  
        :class="classes"
        @click="showAudit" />
    <Dialog v-model:visible="dialog" header="Audit" :modal="true" class="p-fluid">
        <ptj-table :nosort="true" model="audit" :store="audit" :fields="fields" :rows="audit.data.value" />
    </Dialog>
</template>
<script setup>
import Button from "primevue/Button"
import { ref, } from "vue"
import Dialog from 'primevue/dialog'
import { createDataStore } from "./../../js/datastore.js"
import PtjTable from "./../ptj-table.vue"



const props = defineProps({
    store : Object,
    id : Number,
    short : Boolean
});


const dialog = ref(false);

const audit = createDataStore("audit");
audit.filters.value = {"model" : props.store.model, "model-id" : props.id };
audit.route.schema['user-login-id'].custom_fields = ["name"];

const fields = {};
fields.action = audit.route.schema.action;
fields['user-login-id'] = audit.route.schema['user-login-id'];
fields["log"] = audit.route.schema["log"];
fields["--created"] = audit.route.schema["--created"];


let classes = "";
let label = "";

if (props.short) {
    classes = "p-button-rounded p-button-success";
} else {
    classes = "p-button-help";
    label = "Audit";
}

function showAudit() {
    audit.load();
    dialog.value = true;
}

</script>