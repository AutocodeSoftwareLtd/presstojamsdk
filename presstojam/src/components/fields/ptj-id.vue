<template>
    <span>{{ display }}</span>
</template>
<script setup>
import { computed } from "vue"

const props = defineProps({
    modelValue : [Number, String ],
    field : Object
});


let display = computed(() => {
    return (props.field.reference) ? "" : props.modelValue; 
});


</script>