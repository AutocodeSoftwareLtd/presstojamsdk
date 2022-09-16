<template>
    <router-link v-if="field.reference_type == ReferenceTypes.REFERENCE" :to="{ name : 'primary', params : {'model' : field.reference, 'id' : modelValue }}">
        {{ display }}
    </router-link>
    <span v-else>{{ display }}</span>
</template>
<script setup>
import { computed } from "vue"
import { getStoreById } from "./../../js/datastore.js"
import { ReferenceTypes } from "./../../js/meta/id.js";
import { getRoute } from "./../../js/routes.js"

const props = defineProps({
    modelValue : [Number, String ],
    field : Object,
    id : Number,
    model : String
});


function getReferenceLabel(id, name) {
    const row = store.getDataById(id);
    const data = [];
    const ref_route = getRoute(props.field.reference);
    for(const i in ref_route.schema) {
        if (ref_route.schema[i].summary) {
            data.push(row[name + "/" + i]);
        }
    }
    console.log("Data is", data);
    return data.join(" ");
}


let display = computed(() => {
    if (props.field.reference_type == ReferenceTypes.REFERENCE) return getReferenceLabel(props.id, props.field.name);
    else return props.modelValue; 
});


</script>