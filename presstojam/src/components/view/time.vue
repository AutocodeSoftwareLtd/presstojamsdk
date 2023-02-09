<template>
    <span>{{ val }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    value : [Number, String],
    field : Object
});


const val = computed(() => {
    var t = props.field.clean(props.value);
    return (!t) ? t : t.toLocaleDateString("en-UK");
});

</script>
