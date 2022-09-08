<template>
   <span>{{ modelValue }}</span>
</template>

<script setup>

const props = defineProps({
    modelValue : [Number, String],
    field : Object
});



</script>
