<template>
 <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-asset-row')">
  <label :class="Class.getClass('ptj-form-asset-label')">{{ field.meta.label }}</label>
  <input :class="Class.getClass('ptj-form-asset')" ref="input" @change="setFile" :name="field.meta.name" type="file" >
  <ptj-error v-show="field.showError" :error="field.error" />
 </div>
</template>

<script>

import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-asset-field',
  props : {
    field : {
        type : Object,
        required : true
    }
  },
  setup() {
       return { Class };
  },
  methods : {
      setFile(e) {
          if (e.target.files.length > 0) {
            this.field.val = e.target.files[0];
          } else {
            this.field.val = null;
          }
          this.field.validateon = true;
      }
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>