<template>
   <div v-if="tag=='textarea'">{{ value }}</div>
   <div v-else-if="props.field.isEnum()" class="row">
      {{ props.field.clean(value) }}
   </div>
   <div v-else="props.field.isEnum()">{{ props.field.clean(value) }}</div>
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
