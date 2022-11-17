<template>
    <TableDisplay v-if="model" :name="model"/>
</template>
<script setup>
import { watch, ref, inject } from 'vue';
import TableDisplay from "./table-display.vue"
import {  createDataStore } from "../../js/datastore.js"
import { createRepoStore, regStore } from "../../js/reactivestores.js"


const props = defineProps({
    name : String,
    parent_id : Number
});

const client = inject("client");

let childrepo = null;
const childstore = createDataStore(client, props.name);
let model = ref(null);

function loadChild(new_val, old_val) {
    if (new_val == old_val) return;
    childrepo = null;
    let key = childstore.model + "-" + props.parent_id;
    childstore.parent_id = props.parent_id;
    childrepo = createRepoStore(childstore);
    regStore(key, childrepo);
    childrepo.reload();
    model.value = key;
}

watch(() => props.parent_id, loadChild);

loadChild(props.parent_id, 0);

</script>