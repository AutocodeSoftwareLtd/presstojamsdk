<template>
    <span>{{ field.display(modelValue) }}</span>
</template>

<script setup>
import client from "./../../js/client.js"

const props = defineProps({
    modelValue : [Number, Boolean],
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