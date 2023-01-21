<template>
  <TreeSelect v-model="value" :options="options" placeholder="Select Item" />
</template>


<script setup>
import { inject, ref,  } from "vue"

import TreeSelect from 'primevue/treeselect';
import { getModel } from "../../js/models/modelmanager.js"


const props = defineProps({
    modelValue : [Number, String, Boolean],
    model : String,
    common_parent : String,
    common_id : Number
});

const client = inject("client");

const emits = defineEmits([
    "update:modelValue"
]);


const models = [];

const store = getModel(props.model);
const params = { to : props.common_parent };
params[props.common_parent + "/--id"] = props.common_id; 
store.setParams({ to : props.common_parent });
store.load()
.then(() => {
    console.log(store.data.value);
});


const options = ref([]);
let value;

function getOptions() {
    const params = {"__to" : props.common };
    params[props.common + "/--id"] = props.common_id;
    client.get("/data/" + props.field.model, params)
    .then(response => {
        for (const row of response) {
            
        }
       // toTree(response, store.fields
    });
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