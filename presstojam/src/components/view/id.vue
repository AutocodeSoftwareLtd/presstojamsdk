<template>
    <router-link v-if="show_route" :to="{ name : 'primary', params : {'model' : field.reference, 'id' : value }}">
        {{ display }}
    </router-link>
    <span v-else>{{ display }}</span>
</template>
<script setup>
import { computed } from "vue"
import { ReferenceTypes } from "../../js/entity/id.js";
import { hasEntity } from "./../../js/entity/entitymanager.js"
import { getModel } from "../../js/models/modelmanager.js"

const props = defineProps({
    value : [Number, String ],
    field : Object,
    row : Object,
});


let show_route = false;
if (props.field.reference_type == ReferenceTypes.REFERENCE && hasEntity(props.field.reference) && props.value) {
    show_route = true;
}


let display = computed(() => {
    if (props.field.reference_type == ReferenceTypes.REFERENCE) {
        const data = [];
    

        if (props.field.custom_fields.length) {
            for(const field of props.field.custom_fields) {
                data.push(props.row[props.field.name + "/" + field]);
            }
        } else {
            
            const ref_route = getModel(props.field.reference);
            
            for(const i in ref_route.schema) {
                if (ref_route.schema[i].summary) {
                    data.push(props.row[props.field.name + "/" + i]);
                }
            }
        }
        return data.join(" ");
    } else {
        return props.value; 
    }
});


</script>