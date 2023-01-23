<template>
    <TableDisplay v-if="key" :name="key" :key="key"/>
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


let key = ref(0);

function loadChild(new_val, old_val) {
    if (new_val == old_val) return;
    const name = props.name + "-" + new_val;
    key = name;
    let repo;
    if (hasStore(name)) {
        repo = getStore(name);
    } else {
        repo = createRepoStore(getModel(props.name, true));
        repo.parent_id = new_val;
        regStore(name, repo);
    }
    
    repo.load();
}

watch(() => props.parent_id, loadChild);

loadChild(props.parent_id, 0);

</script>