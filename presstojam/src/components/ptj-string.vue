<template>
  <ptj-string-editable v-if="editable" :field="field" />
  <ptj-string-filter v-else-if="filter" :field="field" />
  <ptj-string-display v-else :field="field" />
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"
import PtjStringEditable from "./ptj-string-editable.vue"
import PtjStringDisplay from "./ptj-string-display.vue"
import PtjStringFilter from "./ptj-string-filter.vue"

export default defineComponent({
  name: 'ptj-string',
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
  },
  components : {
      "ptj-string-editable" : PtjStringEditable,
      "ptj-string-display" : PtjStringDisplay,
      "ptj-string-filter" : PtjStringFilter
  }
});
</script>
