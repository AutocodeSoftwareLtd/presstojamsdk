<template>
    <span>{{ display }}</span>
</template>
<script setup>
import { computed } from "vue"
import { getDataStoreById } from "./../../js/datastore.js"

const props = defineProps({
    modelValue : [Number, String ],
    field : Object,
    id : Number,
    model : String
});


function getReferenceLabel(id, name) {
    const active_store = getDataStoreById(props.model);
    const includes = active_store.store.route.schema[name].includes;
    const row = active_store.getDataById(id);
    let data = [];
    for(let include of includes) {
        data.push(row[name + "/" + include]);
    }
    return data.join(" ");
}


let display = computed(() => {
    if (props.field.reference) return getReferenceLabel(props.id, props.field.name);
    else return props.modelValue; 
});


</script>