<template>
  <InputText v-model="modelValue" :disabled="true" />
</template>


<script setup>
import {  ref } from "vue"
import InputText from 'primevue/inputtext'


const props = defineProps({
    modelValue : String,
});


</script>