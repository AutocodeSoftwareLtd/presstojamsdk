<template>
 <div :class="Class.getClass('ptj-form-row') + ' ' + Class.getClass('ptj-filter-form-checkbox-row')">
    <label :class="Class.getClass('ptj-filter-form-checkbox-label')">{{ field.label }}</label>
    <select :name="field.name" v-model="field.val" :class="Class.getClass('ptj-filter-form-checkbox')">
        <option value=''>{{ "All" }}</option>
        <option value='1'>{{ "Checked" }}</option>
        <option value='0'>{{ "Unchecked" }}</option>
    </select>
 </div>
</template>

<script>

import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-checkbox',
   props : {
    field : Object
  },
  setup() {
       return { Class };
  }
});
</script>
