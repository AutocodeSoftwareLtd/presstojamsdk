<template>
    <input :class="Class.getClass('ptj-checkbox')" type="checkbox" :true-value="1" :false-value="0" :name="field.meta.name" v-model="field.val" v-if="editable">
    <select v-else-if="filter" :name="field.meta.name" v-model="field.val" :class="Class.getClass('ptj-filter-form-checkbox')">
        <option :value='0'>{{ "All" }}</option>
        <option :value='1'>{{ "Checked" }}</option>
        <option :value='2'>{{ "Unchecked" }}</option>
    </select>
    <button v-else>{{ field.val }}</button>
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-flag',
  props : {
    field : Object,
    editable : {
        type : Boolean,
        default : false
    },
    filter : {
        type : Boolean,
        default : false
    }
  },
  data() {
      return {
          cval : ""
      }
  },
  setup() {
       return { Class };
  }
});
</script>