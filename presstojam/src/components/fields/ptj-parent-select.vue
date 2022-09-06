<template>
  <TreeSelect v-model="value" :options="options" placeholder="Select Item" />
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"

import TreeSelect from 'primevue/treeselect';
import { getStoreById, hasStore, createDataStore } from "./../../js/datastore.js"
import { getOptions, getRecursiveOptions, toTree } from "./../../js/helperfunctions.js"
import PtjReferenceCreate from "./../actions/ptj-reference-create.vue"

const props = defineProps({
    modelValue : [Number, String, Boolean],
    field : Object,
    common : String,
    common_id : Number
});

const emits = defineEmits([
    "update:modelValue"
]);


const store = (!hasStore(model)) ? createDataStore(model) : getStoreById(model);


const options = ref([]);
let value;

function getOptions() {
    const params = {"__to" : props.common };
    params[props.common + "/--id"] = props.common_id;
    client.get("/data/" + props.field.model, params)
    .then(response => {
        for (const row of response) {
            
        }
        toTree(response, store.route.schema
    })
}


function onCreate(id) {
    value = id;
    if (props.field.reference) {
        store.references[props.field.name].reload()
        .then(() => {
            return getOptions(store, props.field.name)
        }).then(response => {
            options.value =response;
        });
    }
}


</script>