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
import { computed, inject } from "vue"
import InputNumber from "primevue/inputnumber"
import Button from 'primevue/button';

const props = defineProps({
   bind : Object
});


const field = props.bind.cell;
const repo = inject("repo");
const name = props.bind.cell.name;

const min = computed({
    get() {
        return (repo.filters[name]) ? repo.filters[name].min : null;
    },
    set(val) {
        const filters = repo.filters;
        if (!filters[name]) filters[bind.name] = {};
        filters[props.bind.name].min = val;
        repo.reload();
    }
});

const max = computed({
    get() {
        return max_value.value;
    },
    set(val) {
        if (val < min_value.value) val = min_value.value;
        const filters = repo.filters;
        if (!filters[props.bind.name]) filters[props.bind.name] = {};
        filters[props.bind.name].max = val;
        repo.reload();
    }
}); 

function clear() {
    min_value.value = null;
    max_value.value = null;
    const filters = repo.filters;
    if (filters[props.bind.name]) {
        delete filters[props.bind.name];
        repo.reload();
    }
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
