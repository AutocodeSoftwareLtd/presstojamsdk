<template>
    <select v-if="editable" 
        :class="Class.getClass('ptj-form-select')" 
        v-model="field.val"
        :name="field.meta.name"
        v-bind="atts"
         @blur="field.validateon = true"
        >
        <option value="0" selected>Select Option</option>
        <option v-for="option in field.meta.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <select v-else-if="filter"
    :class="Class.getClass('ptj-form-select')" 
        v-model="field.val"
        :name="field.meta.name"
        v-bind="atts"
         @blur="field.validateon = true"
         multiple="true"
        >
        <option value="0" selected disabled>All</option>
        <option v-for="option in field.meta.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <span v-else>{{ field.val }}</span>
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
  computed : {
      atts() {
          
      }
  },
  setup() {
       return { Class };
  }
});
</script>