<template>
    <Calendar id="range" v-model="value" selectionMode="range" :showButtonBar="true"  :manualInput="false" />
</template>

<script setup>
import Calendar from "primevue/Calendar"
import { computed } from "vue"

const props = defineProps({
    modelValue : [Object],
    field : Object
});

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        if (props.modelValue) {
            const arr = [];
            if (props.modelValue.min) arr.push(props.field.buildDate(props.modelValue.min));
            if (props.modelValue.max) arr.push(props.field.buildDate(props.modelValue.max));
            return arr;
        } else {
            return props.modelValue;
        }
    },
    set(val) {
        let obj = null;
        if (val) {
            obj = {};
            if (val[0]) obj.min = props.field.buildString(val[0]);
            if (val[1]) obj.max = props.field.buildString(val[1]);
        }
        emits('update:modelValue', obj);
    }
});



</script>
