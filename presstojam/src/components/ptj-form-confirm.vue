<template>
  <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-form-confirm-row')">
    <label :class="Class.getClass('ptj-form-confirm-label')">{{ field.meta.label }}</label>
    <input :class="Class.getClass('ptj-form-confirm')" 
    :name="name" 
    :type="field.meta.atts.type" v-model="cval" @blur="field.setValidateOn()">
    <ptj-error v-show="error" :error="error" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GCError from "./ptj-error.vue"
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-confirm',
  props : {
    field : Object
  },
  data() {
      return {
          cval : ""
      }
  },
  setup() {
       return { Class };
  },
  computed : {
    name() {
        return this.field.name + "_confirm";
    },
    error() {
        if (this.isvalidateon) {
            if (this.field.val == this.cval) return "";
            else return "Doesn't match " + this.field.name; 
        }      
    }
  },
  components : {
      'ptj-error' : GCError
  }
});
</script>
