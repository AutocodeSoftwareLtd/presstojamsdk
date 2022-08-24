<template>
    <Dropdown :name="field.name" v-model="store.filters[field.name]" optionLabel="label" optionValue="value" :options="[{value : 0, label : 'All' }, { value : 1, label : 'Checked' }, { value : 2, label : 'Unchecked'}]">
    </Dropdown>

</template>

<script setup>
import { inject } from "vue"
import Dropdown from 'primevue/dropdown';

const field = inject("cell");
const store = inject("store");

</script>