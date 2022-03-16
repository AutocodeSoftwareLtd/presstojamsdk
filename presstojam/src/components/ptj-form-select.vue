<template>
  <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-select-row')">
  <label :class="Class.getClass('ptj-form-select-label')">{{ field.label }}</label>
  <select :class="Class.getClass('ptj-form-select')" v-model="field.val" :readonly="field.readonly" :name="field.name" :multiple="field.multiple">
    <option value="0">Select Option</option>
    <option v-for="option in field.options" :key="option.key" :value="option.key">{{ option.value }}</option>
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