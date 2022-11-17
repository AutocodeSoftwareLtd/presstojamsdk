<template>
    <Dropdown 
        :name="field.name" 
        v-model="value" 
        optionLabel="label" 
        optionValue="value" 
        :options="[
            {value : 0, label : 'All' }, 
            { value : 1, label : 'Checked' }, 
            { value : 2, label : 'Unchecked'}]" />
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
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
        if (typeof props.modelValue === 'undefined' || props.modelValue === null) return 0;
        else if (props.modelValue === 0) return 2;
        else return props.modelValue;
    },
    set(val) {
        if (val == 0) val = null;
        else if (val == 2) val = 0;
        emits('update:modelValue', val);
    }
});


</script>