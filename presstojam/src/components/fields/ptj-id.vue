<template>
    <span>{{ display }}</span>
</template>
<script setup>
import { computed,inject } from "vue"


const cell = inject("cell");

const props = defineProps({
    modelValue : [Number, String ]
});


let display = computed(() => {
    return (cell.reference) ? "" : props.modelValue; 
});


</script>