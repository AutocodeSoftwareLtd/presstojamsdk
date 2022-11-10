<template>
   <div class="p-inputgroup">
        <span class="p-inputgroup-addon">min</span>
       <InputNumber
        :name="field.name" 
        v-model="min" 
        v-bind="atts"
        @blur="field.validateon = true" /><span class="p-inputgroup-addon"> - </span>
        <InputNumber
        :name="field.name" 
        v-model="max" 
        v-bind="atts"
        @blur="field.validateon = true" />
        <span class="p-inputgroup-addon">max</span>
        <Button label="clear" @click="clear"/>
   </div>
</template>

<script setup>
import { computed } from "vue"
import InputNumber from "primevue/inputnumber"
import Button from 'primevue/button';

const props = defineProps({
    modelValue : [Object],
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
        let max = null;
        if (props.modelValue) {
            max = (props.modelValue.max < val) ? val : props.modelValue.max;
        }
        emits('update:modelValue', { 'min' : val, 'max' : max });
    }
});

const max = computed({
    get() {
        return (props.modelValue) ? props.modelValue.max : null;
    },
    set(val) {
        let min = null;
        if (props.modelValue) {
            min = (props.modelValue.min > val) ? val : props.modelValue.min;
        }
        emits('update:modelValue', { 'min' : min, max : val});
    }
}); 

function clear() {
    emits('update:modelValue', null);
}



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
