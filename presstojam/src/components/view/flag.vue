<template>
    <i v-if="field.useIcons() && value" class="pi pi-check"></i>
    <span v-else>{{ field.display(value) }}</span>
</template>

<script setup>
import { inject } from "vue"

const client = inject("client");

const props = defineProps({
    value : [Number, Boolean],
    field : Object
});


function submit() {
    let params = {};
    params["--id"] = props.id;
    params[props.field.name] = (props.field.val == 1) ? 0 : 1;
    return client.put("/data/" +  Map.model, params)
    .then(() => {
        props.field.val = (props.field.val == 1) ? 0 : 1;
    })
    .catch(e => {
        console.log(e);
    });
}


</script>