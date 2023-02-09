<template>
    <Button :label="label" icon="pi pi-upload" class="p-button-success mr-2" :class="{'p-button-rounded' : short}" @click="runPublish()" />
</template>
<script setup>
import Button from "primevue/button"
import { inject } from "vue"


const props = defineProps({
    data : Object,
    short : {
        type : Boolean,
        default : false
    }

});

const client = inject("client");

function runPublish() {
    
    client.post("/publish", {"--id":props.data["--id"]})
    .then(response => {
       console.log("Response is", response);
    });
}

let label = "";
if (!props.short) {
    label = "Publish";
}


</script>