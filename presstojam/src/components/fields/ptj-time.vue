<template>
   <span>{{ modelValue }}</span>
</template>

<script setup>
import { inject } from "vue"

const field = inject("cell");
const props = defineProps({
    modelValue : String
});

</script>
