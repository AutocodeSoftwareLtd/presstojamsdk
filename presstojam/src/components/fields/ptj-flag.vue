<template>
    <span>{{ field.display(props.modelValue) }}</span>
</template>

<script setup>
import { inject } from "vue"
import client from "./../../js/client.js"

const field = inject("cell");

const props = defineProps({
    modelValue : [Number, Boolean]
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