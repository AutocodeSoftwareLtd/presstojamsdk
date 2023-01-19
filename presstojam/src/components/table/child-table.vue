<template>
    <TableDisplay v-if="repo" :name="props.name" :key="key"/>
</template>
<script setup>
import { watch, ref } from 'vue';
import TableDisplay from "./table-display.vue"
import {  getModel } from "../../js/models/modelmanager.js"
import { getStore, hasStore, createRepoStore, regStore } from "../../js/data/storemanager.js"


const props = defineProps({
    name : String,
    parent_id : Number
});


let repo = null;
let key = ref(0);
if (hasStore(props.name)) {
    repo = getStore(props.name);
} else {
    repo = createRepoStore(getModel(props.name));
    regStore(props.name, repo);
}

function loadChild(new_val, old_val) {
    if (new_val == old_val) return;
    const name = props.name + "-" + new_val;
    key = name;
    if (hasStore(name)) {
        repo = getStore(name);
    } else {
        repo = createRepoStore(getModel(props.name));
        repo.parent_id = new_val;
        regStore(name, repo);
    }
    
    repo.reload();
}

watch(() => props.parent_id, loadChild);

loadChild(props.parent_id, 0);

</script>