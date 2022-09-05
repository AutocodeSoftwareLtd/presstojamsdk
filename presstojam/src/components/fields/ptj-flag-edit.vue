<template>
    <Checkbox v-model="value" :binary="true"></Checkbox>

</template>

<script setup>
import Checkbox from 'primevue/checkbox';
import { computed } from "vue"

const props = defineProps({
    modelValue : [Number, Boolean],
    field : Object
});

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return (props.modelValue) ? true : false;
    },
    set(val) {
        emits('update:modelValue', (val) ? 1 : 0);
    }
});




</script>