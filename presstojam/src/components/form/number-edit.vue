<template>
   <InputNumber
        class="focus:border-primary"
        :name="bind.cell.name" 
        :class="bind.classes"
        v-model="value" 
        v-bind="atts"
        @blur="bind.active_validation = true" />
</template>

<script setup>

import InputNumber from "primevue/inputnumber"
import { computed, ref } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});

const cvalue = ref(props.bind.value);

const value = computed({
    get() {
        return cvalue.value;
    },
    set(val) {
        props.bind.setValue(val);
        cvalue.value = val;
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
