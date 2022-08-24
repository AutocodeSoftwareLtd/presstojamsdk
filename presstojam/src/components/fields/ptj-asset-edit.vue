<template>
    <FileUpload :name="field.name" :customUpload="true" @uploader="uploadFile">
    <template #empty>
        <p>Drag and drop files to here to upload.</p>
    </template>
</FileUpload>
</template>

<script setup>
import { inject } from "vue"
import FileUpload from "primevue/FileUpload"

const field = inject("cell");
const store = inject("store");

function uploadFile(e) {
    console.log(e.files);
}

</script>
