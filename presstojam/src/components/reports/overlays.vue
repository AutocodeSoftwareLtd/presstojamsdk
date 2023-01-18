<template>
    <MultiSelect v-model="overlay" :options="options" optionLabel="name" @change="onChange" />
</template>
<script setup>
import MultiSelect from 'primevue/multiselect';
import { computed } from "vue"

const props = defineProps({
    report : Object
});

const emits = defineEmits([
    "changed"
]);

const overlay = computed({
    get() {
        return props.report.active;
    },
    set(val) {
        props.report.active = val;
    }
});


const options = [];
for(let i in props.report.results) {
    options.push({
        name : i,
        code : i
    });
}

function onChange() {
    emits("changed");
}


</script>