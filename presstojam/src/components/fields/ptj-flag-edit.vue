<template>
    <Checkbox v-model="store.active[cell.name]" :binary="true"></Checkbox>

</template>

<script setup>
import { inject } from "vue"
import Checkbox from 'primevue/checkbox';

const cell = inject("cell");
const store = inject("store");



</script>