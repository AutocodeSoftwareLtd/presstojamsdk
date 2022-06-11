<template>
    <p class="ptj-error" v-if="error">{{ getDictionary('ptj-error-' + error, { 'type' : type}) }}</p>
</template>

<script setup>
import { getDictionary } from "./../js/dictionary.js"
import { getError } from "./../js/error.js"
defineProps({
    'error' : Number,
    'type' : String
});

</script>

<style>
.ptj-error {
  color : red;
}
</style>