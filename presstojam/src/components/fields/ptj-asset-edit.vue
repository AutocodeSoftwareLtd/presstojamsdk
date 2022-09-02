<template>
    <FileUpload :name="field.name" :customUpload="true" @uploader="uploadFile">
    <template #empty>
        <p>Drag and drop files to here to upload.</p>
    </template>
</FileUpload>
</template>

<script setup>
import FileUpload from "primevue/FileUpload"
import { computed } from "vue"

const props = defineProps({
    modelValue : String,
    field : Object,
    id : Number
});

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});


function uploadFile(e) {
    console.log(e.files);
}

</script>
