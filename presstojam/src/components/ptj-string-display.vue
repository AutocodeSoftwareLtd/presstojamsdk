<template>
   <div v-if="tag=='textarea'">{{ field.val }}</div>
   <span v-else>{{ field.val }}</span>
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-string-display',
  props : {
    field : Object,
  },
  setup() {
       return { Class };
  },
  computed : {
      tag() {
          if (this.field.meta.html || this.field.meta.max > 150) {
              return "textarea";
          } else {
              return "input";
          }
      }
  }
});
</script>
