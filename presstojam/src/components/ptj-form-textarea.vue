<template>
    <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-textarea-row') + ' ' + field.name.replace('_', '-')">
       <label :class="Class.getClass('ptj-form-textarea-label')">{{ field.label }}</label>
       <textarea :class="Class.getClass('ptj-form-textarea')" :name="field.name" v-model="field.val" :readonly="field.readonly" :data-html="field.atts.html"></textarea>        
       <ptj-error v-show="field.error" :error="field.error" />
    </div>
</template>

<script>

import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-textarea',
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
