<template>
  <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-checkbox-row')">
    <label :class="Class.getClass('ptj-checkbox-label')">{{ field.label }}</label>
    <input :class="Class.getClass('ptj-checkbox')" type="checkbox" :true-value="1" :false-value="0" :name="field.name" v-model="field.val">
    <ptj-error v-show="field.showError" :error="field.error" />
  </div>
</template>

<script>

import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-checkbox',
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
