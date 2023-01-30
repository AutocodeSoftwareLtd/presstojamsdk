<template>
   <MultiSelect v-if="tag=='select'" display="chip" placeholder="Please Select" v-model="value" :options="options" optionLabel="key" optionValue="value" />
   <Chips v-model="value" v-else-if="tag=='input'"  />
</template>

<script setup>
import { ref, computed, inject } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';

const props = defineProps({
    bind : Object
});

const repo = inject("repo");

const options = ref([]);

const value = computed({
    get() {
        return repo.filters[props.bind.cell.name];
    },
    set(val) {
        const filter = repo.filters;
        if (!val.length) {
            if (filter[props.bind.name]) {
                delete filter[props.bind.cell.name];
                repo.reload();
            }
        } else {
            if (props.bind.cell.isEnum()) {
                filter[props.bind.cell.name] = val;
            } else {
                const oval = [];
                for(const i in val) {
                    oval.push("%" + val[i] + "%");
                }
            }
            repo.reload();
        }
    }
});

const tag = computed(() => {
if (props.bind.cell.isEnum()) {
    const coptions = [];
    for(let i in props.bind.cell.list) {
        coptions.push({ key : props.bind.cell.list[i], value : props.bind.cell.list[i] });
    }

    options.value = coptions;
    return "select";
} else {
    return "input";
}
});


</script>
