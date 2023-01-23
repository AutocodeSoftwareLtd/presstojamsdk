<template>
    <FileUpload 
        mode="basic" 
        :name="bind.cell.name"  
        :customUpload="true"
       
        :maxFileSize="1000000" 
        @select="onUpload" />
</template>

<script setup>
import FileUpload from "primevue/FileUpload"
import { computed } from "vue"

// accept="image/*" 


const props = defineProps({
    bind : {
        type : Object,
        required : true
    },
    id : Number
});



function onUpload(e) {
    if (e.files.length == 0) {
        props.bind.value = null;
    } else {
        props.bind.setValue(e.files[0]);
    }
}

</script>
