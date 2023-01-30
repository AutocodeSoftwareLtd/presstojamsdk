<template>
  <TreeSelect v-model="value" :options="options" placeholder="Select Item" />
</template>


<script setup>
import { inject, ref,  } from "vue"

import TreeSelect from 'primevue/treeselect';
import { RepoData } from "../../js/data/repodata.js"


const props = defineProps({
    data : Object,
    common_id : Number,
    common_parent : String
});

const client = inject("client");
const options = ref([]);

const models = [];

const repo = new RepoData(props.data.model.name);
repo.to = props.common_parent;

const params = {};
params[props.data.common_parent + "/--id"] = props.data.common_id; 
repo.filters = params;
repo.load()
.then(() => {
    options.value = repo.data.value;
});



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