<template>
    <Calendar v-model="value" selectionMode="range" :manualInput="false" />
</template>

<script setup>
import Calendar from "primevue/Calendar"
import { computed, ref, inject, toRaw } from "vue"

const props = defineProps({
    bind : Object
});


const repo = inject("repo");

const value = computed({
    get() {
        return repo.filters[props.bind.cell.name];
    },
    set(ival) {
        let obj = null;
        if (ival) {
            obj = {};
            if (ival[0]) obj.min = props.bind.cell.buildString(ival[0]);
            if (ival[1]) obj.max = props.bind.cell.buildString(ival[1]);
        }
        const filters = repo.filters;
        if (filters[props.bind.cell.name] != ival) {
            filters[props.bind.cell.name] = ival;
            repo.reload();
        }
    }
});



</script>
