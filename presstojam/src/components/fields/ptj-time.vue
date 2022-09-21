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
    var t = props.modelValue.split(/[- :]/);
    return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])).toLocaleDateString("en-UK");
});

</script>
