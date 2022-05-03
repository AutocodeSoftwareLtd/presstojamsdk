<template>
  <div class="ptj-form-row" :class="field.name">
  <label class="ptj-form-label">{{ field.label }}</label>
  <slot />
  <ptj-error v-show="field.showError" :error="field.error" />
  </div>
</template>

<script setup>
import PtjError from "./ptj-error.vue"

const props = defineProps({
    field : Object
});

</script>