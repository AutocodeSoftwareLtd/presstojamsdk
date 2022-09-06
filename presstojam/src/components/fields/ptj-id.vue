<template>
    <router-link v-if="field.reference" :to="{ name : 'primary', params : {'model' : field.reference_to, 'id' : modelValue }}">
        {{ display }}
    </router-link>
    <span v-else>{{ display }}</span>
</template>
<script setup>
import { computed } from "vue"
import { getStoreById } from "./../../js/datastore.js"

const props = defineProps({
    modelValue : [Number, String ],
    field : Object,
    id : Number,
    model : String
});


function getReferenceLabel(id, name) {
    const store = getStoreById(props.model);
    const includes = store.route.schema[name].includes;
    const row = store.getDataById(id);
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