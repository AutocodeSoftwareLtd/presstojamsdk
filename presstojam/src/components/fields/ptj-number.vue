<template>
   <span >{{ modelValue }}</span>
</template>

<script setup>
import { computed, inject } from "vue"

const field = inject("cell");
const props = defineProps({
    modelValue : [Number, String]
});

</script>
