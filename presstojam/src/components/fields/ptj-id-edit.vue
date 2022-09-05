<template>
  <Dropdown v-if="field.reference" placeholder="Please Select" :field="field" :options="options" optionValue="key" optionLabel="value" v-model="value"/>
  <TreeSelect v-else-if="field.recursive" v-model="selectedNodeKey" :options="nodes" placeholder="Select Item" />
  <InputNumber v-else :name="field.name" v-model="value" :disabled="true" />
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import Dropdown from 'primevue/dropdown';
import InputNumber from "primevue/InputNumber"
import TreeSelect from 'primevue/treeselect';
import { getDataStoreById } from "./../../js/datastore.js"
import { toTree } from "./../../js/helperfunctions.js"

const props = defineProps({
    modelValue : [Number, Boolean],
    field : Object
});

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return parseInt(props.modelValue);
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

const model = inject("model");
const active_store = getDataStoreById(model);


const options = ref([]);

function sortByDictionary(a, b) {
    if (a.value < b.value ) {
        return -1;
    } else if (a.value > b.value) {
        return 1;
    } else {
        return 0;
    }
} 

function getOptions() {
    active_store.getReference(props.field.name)
    .then(response => {
        response.sort(sortByDictionary);
        options.value = response;
    });
}

function getRecursiveOptions() {
    active_store.load()
    .then(() => {
        options.value = toTree(active_store.store.data, active_store.store.route.schema);
    });
}


if (props.field.reference) {
    onMounted(() => {
       getOptions();
    });  
} else if (props.field.recursive) {
    onMounted(() => {
       getRecursiveOptions();
    });  
}


</script>