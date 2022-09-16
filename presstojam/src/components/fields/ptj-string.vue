<template>
   <div v-if="tag=='textarea'">{{ modelValue }}</div>
  <span v-else>{{ modelValue }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    modelValue : [String],
    field : Object
});

const tag = computed(() => {
 if (props.field.html || props.field.max > 300) {
    return "textarea";
 } else {
    return "input";
 }
});



</script>
