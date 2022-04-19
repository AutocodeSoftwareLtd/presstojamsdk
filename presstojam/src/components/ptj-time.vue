<template>
  <input v-if="editable"
        :class="Class.getClass('ptj-form-time')" 
        :name="field.meta.name" 
        type="datetime-local" 
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly">
   <div v-else-if="filter">
      <input 
        :class="Class.getClass('ptj-filter-form-time-1')" 
        type="datetime-local" 
        v-model="field.val1">
        -
        <input 
            :class="Class.getClass('ptj-filter-form-time-2')" 
            type="datetime-local" 
            v-model="field.val2"
        >
   </div>
   <span v-else>{{ field.val }}</span>
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-time',
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
