<template>
   <div v-if="tag=='textarea'">{{ modelValue }}</div>
  <span v-else>{{ modelValue }}</span>
</template>

<script setup>
import { ref, inject, computed } from "vue"


const field = inject("cell");

const props = defineProps({
    modelValue : [String]
});


const tag = computed(() => {
 if (field.html || field.max > 300) {
    return "textarea";
 } else {
    return "input";
 }
});



</script>
