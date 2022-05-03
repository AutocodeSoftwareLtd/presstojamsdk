<template>
   <input v-if="type=='edit'" class="ptj-form-asset" 
    ref="input" @change="setFile" 
    :name="field.meta.name" 
    type="file" >
   <span v-else>{{ field.val }}</span>
   
</template>

<script setup>
defineProps({
    field : Object,
    type : {
        type : String,
        default : 'view'
    }
});
</script>
