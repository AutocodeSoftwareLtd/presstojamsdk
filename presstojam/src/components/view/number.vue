<template>
    <span>{{ value }}</span>
</template>

<script setup>

const props = defineProps({
    value : [Number, String],
    field : Object
});

</script>
