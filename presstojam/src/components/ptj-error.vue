<template>
    <p class="ptj-error" v-if="field.error">{{ getDictionary('ptj-error-' + field.error, { 'type' : field.type, 'val' : field.meta.getErrorVal(field.error) }) }}</p>
</template>

<script setup>
import { getDictionary } from "./../js/dictionary.js"
import { getError } from "./../js/error.js"
defineProps({
    'field' : [Object, Function]
});

</script>

<style>
.ptj-error {
  color : red;
}
</style>