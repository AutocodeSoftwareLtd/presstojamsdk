<template>
   <MultiSelect v-if="tag=='select'" display="chip" v-model="store.filters[field.name]" :options="options" optionLabel="key" optionValue="value" />
   <Chips v-model="store.filters[field.name]" v-else-if="tag=='input'"  />
</template>

<script setup>
import { ref, computed, inject } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';

const field = inject("cell");
const store = inject("store");

const options = ref([]);

const tag = computed(() => {
if (field.isEnum()) {
    field.setContainsAsOptions(options);
    return "select";
} else if (field.encrypted) {
    return "";
} else {
    return "input";
}
});


</script>
