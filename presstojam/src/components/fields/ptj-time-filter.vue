<template>
    <Calendar id="range" v-model="store.filters[cell.name]" selectionMode="range" :manualInput="false" />
</template>

<script setup>
import { inject } from "vue"
import Calendar from "primevue/Calendar"

const cell = inject("cell");
const store = inject("store");


</script>
