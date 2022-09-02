<template>
   <InputNumber
        class="focus:border-primary"
        :name="field.name" 
        v-model="value" 
        v-bind="atts"
        @blur="field.validateon = true" />
</template>

<script setup>
import { computed } from "vue"
import InputNumber from "primevue/InputNumber"

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



const atts = computed(() => {
    let atts = {};
    if (props.field.round) {
        let step = "0.";
        for(let i=0; i<props.field.round - 1; ++i) {
            step += "0";
        }
        step += "1";
        atts["step"]  = parseInt(step);
    }
    return atts;
});
</script>
