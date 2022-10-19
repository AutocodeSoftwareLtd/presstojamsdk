<template>
   <ptj-table :nosort="true" name="audit_repo" :fields="fields" />
</template>
<script setup>
import { onMounted, ref, inject } from "vue"
import { createDataStore } from "./../../js/datastore.js"
import { createRepoStore, regStore } from "./../../js/reactivestores.js"
import PtjTable from "./../ptj-table.vue"



const props = defineProps({
    repo : {
        type : Object,
        required : true
    },
    id : {
        type : Number,
        required : true
    }
});

const client = inject("client");

const audit = createDataStore(client, "audit");
audit.route.schema['user-login-id'].custom_fields = ["name"];

const fields = {};
fields.action = audit.route.schema.action;
fields['user-login-id'] = audit.route.schema['user-login-id'];
fields["log"] = audit.route.schema["log"];
fields["--created"] = audit.route.schema["--created"];


const audit_repo = createRepoStore(audit);
regStore("audit_repo", audit_repo);

onMounted(() => {
    audit.filters = {"model" : props.repo.store.model, "model-id" : props.id };
    audit_repo.reload();
});


</script>