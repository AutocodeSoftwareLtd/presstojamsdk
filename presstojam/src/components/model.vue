<template>
    <div>
        <component :is="component" :model="model" />
    </div>
</template>
<script setup>

import { getModel, clearModelCache } from "../js/models/modelstore.js"
import { clearStores } from "../js/reactivestores.js";
import { inject, computed } from "vue"
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


const client = inject("client");

function setupModel() {

    clearModelCache();
    clearStores();

    const store = getModel(client, props.model);


    if (props.is_active) {
        for(const child of store.route.schema["--id"].reference) {
            const child_store = getModel(client, child);
            child_store.parent_id = props.id;
        }
                    
        store.active_id = props.id;
    
    } else {
        store.parent_id = props.id;
    }
}

setupModel();
</script>