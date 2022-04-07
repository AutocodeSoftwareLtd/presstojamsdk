<template>
 <ptj-widget title="search" v-slot="slotScope">
   <form @submit.prevent="submit" :class="Class.getClass('ptj-filter-form')">
      <h1>Search {{ store.title }}</h1>
      <div v-for="field in store.data_template.cells" :key="field.meta.name" :class="Class.getClass('ptj-filter-form-group')">
          <ptj-select v-if="field.meta.type=='select'" :field="field" :multiple="true"  :stores="store"/>
          <ptj-filter-checkbox v-else-if="field.meta.type=='checkbox'" :field="field"  :stores="store"/>
          <ptj-time-range v-else-if="field.meta.atts.type=='datetime'" :field="field"  :stores="store"/>
          <ptj-input v-else :field="field" :stores="store" />
               
          <!-- REMOVED: -->
      </div>
      <input type="submit" value="Submit" :class="Class.getClass('ptj-filter-form-submit')" @click="slotScope.toggleWidget">
  </form>
 </ptj-widget>
</template>

<script>


import { defineComponent } from 'vue'
import GCInput from "./ptj-form-input.vue"
import GCFormSelect from "./ptj-form-select.vue"
import GCCheckbox from "./ptj-form-checkbox.vue"
import GCFilterFormTime from "./ptj-filter-form-time.vue"
import GCFilterFormCheckbox from "./ptj-filter-form-checkbox.vue"
import GCWidget from "./ptj-widget-window.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


 
export default defineComponent({
  name: 'ptj-filter-form',
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
  methods : {
    submit() {
      this.store.reload();
      Ctrl.buildLink(true);
    }
  },
  components : 
    {
      "ptj-input" : GCInput,
      "ptj-select" : GCFormSelect,
      "ptj-checkbox" : GCCheckbox,
      "ptj-time-range" : GCFilterFormTime,
      "ptj-filter-checkbox" : GCFilterFormCheckbox,
      "ptj-widget" : GCWidget
    }
       
  
});
</script>
<style scoped>
.error {
  color : red;
}

</style>

