<template>
    <div>
        <component :is="component" :model="model" />
    </div>
</template>
<script setup>

import { getModel, clearModelCache } from "../js/models/modelmanager.js"
import { clearStores, regStore, createActiveStore, createRepoStore } from "../js/data/storemanager.js";
import { computed } from "vue"
import PtjRepo from "./repo/repo.vue"
import PtjActive from "./active/active.vue"


const props = defineProps({
    model : String,
    is_active : false,
    id : {
        type : [Number, String],
        default : 0
    }
});


const component = computed(() => {
    return (props.is_active) ? PtjActive : PtjRepo;
});


function setupModel() {

    clearModelCache();
    clearStores();

    const store = getModel(props.model);


    if (props.is_active) {
        const active = createActiveStore(store, props.id);
        regStore(props.model, active);

        for(const child of store.fields["--id"].reference) {
            const child_store = getModel(child);
            const repo = createRepoStore(child_store);
            repo.parent_id = props.id;
            regStore(child, repo);
        }
    } else {
        const repo = createRepoStore(store);
        repo.parent_id = props.id;
        regStore(props.model, repo);
    }
}

setupModel();
</script>