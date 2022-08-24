<template>
    <Calendar id="range" v-model="store.active[cell.name]" :manualInput="true" />
</template>

<script setup>
import { inject } from "vue"
import Calendar from "primevue/Calendar"
const cell = inject("cell");
const store = inject("store");

</script>
