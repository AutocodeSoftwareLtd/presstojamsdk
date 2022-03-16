<template>
    <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-radio-row')">
      <label :class="Class.getClass('ptj-form-radio-label')">{{ field.label }}</label>
        <div v-for="option in field.options" :key="option">
            <label :class="Class.getClass('ptj-form-radio-option-label')">{{ option.option }}</label>
            <input :name="cfield.name" type="radio" :value="option.value" v-model="field.val">
        </div>
        <ptj-error v-show="field.error" :error="field.error" />
    </div>
</template>

<script>

import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-radio',
  props : {
    field : Object
  },
  setup() {
       return { Class };
  },
  data() {
      return {
          isvalidateon : false
      }
  },
  methods : {
      setValidateOn() {
          this.isvalidateon = true;
      }
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>


