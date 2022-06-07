<template>
  <div class="ptj-form-row" :class="field.name">
  <label class="ptj-form-label">{{ getDictionary('label', { "model" : Map.model, "field" : field.name, default : field.name }) }}</label>
  <slot />
  <ptj-error v-show="field.showError" :error="field.error" :type="field.type" />
  </div>
</template>

<script setup>
import PtjError from "./ptj-error.vue"
import { getDictionary } from "./../js/dictionary.js"
import { Map } from "./../js/map.js"


const props = defineProps({
    field : [Object, Function]
});


</script>