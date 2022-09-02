<template>
   <div>
       <InputNumber
        :name="field.name" 
        v-model="min" 
        v-bind="atts"
        @blur="field.validateon = true" /> - 
        <InputNumber
        :name="field.name" 
        v-model="max" 
        v-bind="atts"
        @blur="field.validateon = true" />
   </div>
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

const min = computed({
    get() {
        return (props.modelValue) ? props.modelValue.min : null;
    },
    set(val) {
        emits('update:modelValue', { 'min' : val, 'max' : max });
    }
});

const max = computed({
    get() {
        return (props.modelValue) ? props.modelValue.max : null;
    },
    set(val) {
        emits('update:modelValue', { 'min' : min, max : val});
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
