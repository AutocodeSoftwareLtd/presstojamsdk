<template>
   <span>{{ modelValue }}   <a @click="download()"><span class="material-icons">download</span></a></span>
   
</template>

<script setup>
import client from "./../../js/client.js"

const props = defineProps({
    modelValue : String,
    field : Object,
    id : Number
});


function download() {
    client.getAsset("/asset/" + props.field.model + "/" + props.field.name + "/" + props.id)
    .then(blob => {

        const anchor = document.createElement("a");
        const url = URL.createObjectURL(blob);
        anchor.href = url;
        anchor.download = props.field.val;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    })
    .catch(e => {
        console.log(e);
    });
}
</script>
