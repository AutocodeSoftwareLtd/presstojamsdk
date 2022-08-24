<template>
  <MultiSelect v-if="field.reference" :field="field" :options="options" v-model="store.active[field.name]"/>
</template>


<script setup>
import { inject, ref } from "vue"
import MultiSelect from 'primevue/multiselect';
import { getReference } from "./../../js/datastore.js"

const field = inject("cell");
const store = inject("store");

const options = ref([]);

function getOptions() {
    getReference(field.model, field.name, id)
    .then(response => {
        options.value = response;
    });
}


if (field.reference || field.recursive) {
    onMounted(() => {
       getOptions();
    });
    
}


</script>