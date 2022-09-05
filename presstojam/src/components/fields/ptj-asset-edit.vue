<template>
    <FileUpload 
        mode="basic" 
        :name="field.name"  
        :customUpload="true"
       
        :maxFileSize="1000000" 
        @select="onUpload" />
</template>

<script setup>
import FileUpload from "primevue/FileUpload"
import { computed } from "vue"
import { AssetManager } from "./../../js/assetmanager.js" 

// accept="image/*" 


const props = defineProps({
    modelValue : [String, Object],
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


function onUpload(e) {
    if (e.files.length == 0) {
        value.value = null;
    } else {
        const assetManager = new AssetManager();
        assetManager.upload(e.files[0]);
        value.value = assetManager;
    }
}

</script>
