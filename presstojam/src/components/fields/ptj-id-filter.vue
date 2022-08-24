<template>
  <MultiSelect v-if="field.reference" :field="field" :options="options" optionLabel="key" optionValue="value" v-model="store.filters[field.name]" />
  <Chips v-model="store.filters[field.name]" v-else  />
</template>


<script setup>
import { computed, ref, onMounted, inject } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';
import { getReference } from "./../../js/datastore.js"

const field = inject("cell");
const store = inject("store");


const options = ref([]);

async function getOptions() {
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