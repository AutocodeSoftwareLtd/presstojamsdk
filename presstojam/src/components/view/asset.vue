<template>
   <span>{{ value }}   <a @click="download()"><i class="pi pi-download"></i></a></span>
</template>

<script setup>
import { inject } from "vue"

const client = inject("client");

const props = defineProps({
    value : String,
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
