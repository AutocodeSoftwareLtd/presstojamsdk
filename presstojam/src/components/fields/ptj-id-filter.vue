<template>
  <MultiSelect v-if="field.reference" :field="field" :options="options" optionLabel="key" optionValue="value" v-model="value" />
  <Chips v-model="value" v-else  />
</template>


<script setup>
import { ref, onMounted, inject, computed } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';
import { getDataStoreById } from "./../../js/datastore.js"

const props = defineProps({
    modelValue : [Number, Boolean],
    field : Object
});


const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

const model = inject("model");
const active_store = getDataStoreById(model);



const options = ref([]);

async function getOptions() {
    active_store.getReference(field.name)
    .then(response => {
        options.value = response;
    });
}


if (props.field.reference || props.field.recursive) {
    onMounted(() => {
       getOptions();
    });
    
}


</script>