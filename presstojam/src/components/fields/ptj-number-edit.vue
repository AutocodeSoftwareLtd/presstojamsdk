<template>
   <InputNumber
        class="" 
        :name="field.name" 
        v-model="store.active[field.name]" 
        v-bind="atts"
        @blur="field.validateon = true" />
</template>

<script setup>
import { computed, inject } from "vue"
import InputNumber from "primevue/InputNumber"

const field = inject("cell");
const store = inject("store");



const atts = computed(() => {
    let atts = {};
    if (field.round) {
        let step = "0.";
        for(let i=0; i<field.round - 1; ++i) {
            step += "0";
        }
        step += "1";
        atts["step"]  = step;
    }
    return atts;
});
</script>
