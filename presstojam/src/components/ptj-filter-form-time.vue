<template>
 <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-filter-form-time-row')">
  <label :class="Class.getClass('ptj-filter-form-time-label')">{{ field.meta.label }}</label>
  <input :class="Class.getClass('ptj-filter-form-time-1')" type="datetime-local" v-model="field.val1">
  <input :class="Class.getClass('ptj-filter-form-time-2')" type="datetime-local" v-model="field.val2">
  <ptj-error v-show="field.error" :error="field.error" />
 </div>
</template>

<script>
import GCError from "./ptj-error.vue"
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-time-range',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>