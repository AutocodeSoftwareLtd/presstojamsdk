<template>
   <span>{{ val }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    modelValue : [Number, String],
    field : Object
});


const val = computed(() => {
    var t = props.field.clean(props.modelValue);
    const offset = t.getTimezoneOffset();
    return t.toLocaleDateString("en-UK");
});

</script>
