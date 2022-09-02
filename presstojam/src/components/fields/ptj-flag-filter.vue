<template>
    <Dropdown :name="field.name" v-model="value" optionLabel="label" optionValue="value" :options="[{value : 0, label : 'All' }, { value : 1, label : 'Checked' }, { value : 2, label : 'Unchecked'}]">
    </Dropdown>

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
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});


</script>