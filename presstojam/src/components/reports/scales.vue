<template>
    <Dropdown v-model="scale" :options="options" @change="onChange" />
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

const scale = computed({
    get() {
        return props.report.scale;
    },
    set(val) {
        props.report.active = scale;
    }
});


const options = [];
for(let i in props.report.fields) {
    if (props.report.fields[i].type == "time") {
        options.push({
            name : i,
            code : i
        });
    }
}

function onChange() {
    emits("changed");
}


</script>