<template>
    <ptj-filter 
        class="ptj-filter" 
        v-for="field in filtercells" :field="field" :key="field.name" />
</template>
<script setup>

import PtjFilter from "./ptj-filter.vue"
import { computed, provide } from "vue"


const props = defineProps({
    model : String,
    store : Object
});

provide("model", props.model);

const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in props.store.route.schema) {
        if (props.store.route.schema[i].background) continue;
        if (props.store.route.schema[i].constructor.name == "Asset") continue;
        filter_cells[i] = props.store.route.schema[i];
    }
    return filter_cells;
});

</script>
<style>
.ptj-filter { 
    display : inline-block;
}
</style>