<template>
  <input v-if="editable"
        :class="Class.getClass('ptj-form-number')" 
        :name="field.meta.name" 
        type="number" 
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly">
   <div v-else-if="filter">
       <input v-if="editable"
        :class="Class.getClass('ptj-form-number')" 
        :name="field.meta.name" 
        type="number" 
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly"> - 
        <input v-if="editable"
        :class="Class.getClass('ptj-form-number')" 
        :name="field.meta.name" 
        type="number" 
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly">
   </div>
   <span v-else>{{ field.val }}</span>
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-number',
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
  setup() {
       return { Class };
  }
});
</script>
