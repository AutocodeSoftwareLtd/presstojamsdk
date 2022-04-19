<template>
  <div :class="classes">
  <label :class="Class.getClass('ptj-form-label')">{{ field.meta.label }}</label>
  <slot />
  <ptj-error v-show="field.showError" :error="field.error" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"


export default defineComponent({
   props : {
    field : Object
  },
  setup(props) {
       return { Class };
  },
  computed : {
      classes() {
          return Class.getClass('ptj-form-row') + ' ' + this.field.meta.type;
      }
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>