<template>
  <Dropdown v-if="field.reference || field.recursive" :field="field" :options="options" optionValue="key" optionLabel="value" v-model="value"/>
  <InputNumber v-else :name="field.name" v-model="value" :disabled="true" />
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import Dropdown from 'primevue/dropdown';
import InputNumber from "primevue/InputNumber"
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
        let arr = response;
        arr.unshift({ "key" : 0, "value" : "Please Select"});
        options.value = arr;
    });
}

function getRecursiveOptions() {
    active_store.load()
    .then(() => {
        let arr = [];
        arr.push({ "key" : 0, "value" : "Please Select"});
        for(let i in store.data) {
            let vls = [];
            for(let x in store.cells) {
                if (store.cells[x].summary) {
                    vls.push(store.data[i][x]);
                }
            }
            arr.push({"key" : store.data[i]["--id"], "value" : vls.join(" ")});
        }
        arr.sort(sortByDictionary);
        options.value = arr;
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