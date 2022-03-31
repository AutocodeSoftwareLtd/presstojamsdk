<template>
  <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-select-row')">
  <label :class="Class.getClass('ptj-form-select-label')">{{ field.meta.label }}</label>
  <select :class="Class.getClass('ptj-form-select')" v-model="field.val" :readonly="field.meta.readonly" :name="field.meta.name" :multiple="field.meta.multiple">
    <option value="0" selected disabled>Select Option</option>
    <option v-for="option in field.meta.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <ptj-error v-show="field.showError" :error="field.error" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"


export default defineComponent({
   props : {
    field : Object
  },
  setup(props) {
       return { Class };
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>