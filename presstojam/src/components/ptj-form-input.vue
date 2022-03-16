<template>
  <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-input-row') + ' ' + field.name">
    <label v-if="field.atts.type != 'hidden'" :class="Class.getClass('ptj-form-input-label')">{{ field.label }}</label>
    <input :class="Class.getClass('ptj-form-input')" :name="field.name" :type="field.atts.type" v-model="field.val" @blur="field.validateon = true" :readonly="field.readonly">
    <ptj-error v-show="field.showError" :error="field.error" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-input',
  props : {
    field : Object
  },
  setup() {
       return { Class };
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>
