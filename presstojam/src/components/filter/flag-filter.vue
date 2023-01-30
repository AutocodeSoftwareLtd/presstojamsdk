<template>
    <Dropdown 
        :name="bind.cell.name" 
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
import { computed,inject } from "vue"


const props = defineProps({
    bind : Object
});

const repo = inject("repo");

const value = computed({
    get() {
        return (!repo.filters[props.bind.cell.name]) ? { value : 0, label : 'All'} : repo.filters[props.bind.cell.name];
    },
    set(val) {
        if (val == 0) val = null;
        else if (val == 2) val = 0;
        if (val != repo.filters[props.bind.cell.name]) {
            repo.filters[props.bind.cell.name] = val;
            repo.reload();
        }
    }
});


</script>