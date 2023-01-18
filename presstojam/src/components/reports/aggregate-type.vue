<template>
    <Dropdown v-model="type" :options="types" @change="onChange"/>
</template>
<script setup>
import Dropdown from 'primevue/dropdown';
import { computed } from "vue"

const props = defineProps({
    report : Object
});

const emits = defineEmits([
    "changed"
]);

const type = computed({
    get() {
        return props.report.agg_type;
    },
    set(val) {
        props.report.agg_type = val;
    }
});


const options = [
    {
        name : 'Sum',
        code : 'sum'
    },
    {
        name : 'Average',
        code  : 'avg'
    },
    {
        name : 'Minimum',
        code : 'min'
    },
    { 
        name : 'Maximum',
        code : 'max'
    }
];


function onChange() {
    emits("changed");
}



</script>