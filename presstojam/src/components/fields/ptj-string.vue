<template>
   <div v-if="tag=='textarea'">{{ value }}</div>
  <span v-else>{{ props.field.clean(value) }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    value : [String],
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
