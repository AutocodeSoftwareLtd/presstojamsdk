<template>
   <InputNumber
        class="focus:border-primary"
        :name="bind.cell.name" 
        v-model="value" 
        v-bind="atts"
        @blur="bind.active_validation.value = true" />
</template>

<script setup>

import InputNumber from "primevue/InputNumber"
import { computed } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});

const value = computed({
    get() {
        return props.bind.value.value;
    },
    set(val) {
        props.bind.setValue(val);
    }
});



const cell = props.bind.cell;
const atts = {};
if (cell.round) {
    let step = "0.";
    for(let i=0; i<cell.round - 1; ++i) {
        step += "0";
    }
    step += "1";
    atts["step"]  = parseInt(step);
}
</script>
