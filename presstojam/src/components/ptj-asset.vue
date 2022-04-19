<template>
   <input v-if="editable" :class="Class.getClass('ptj-form-asset')" 
    ref="input" @change="setFile" 
    :name="field.meta.name" 
    type="file" >
   <span v-else>{{ field.val }}</span>
   
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-asset',
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
