<template>
 <ptj-widget title="search" v-slot="slotScope">
   <form @submit.prevent="submit" :class="Class.getClass('ptj-filter-form')">
      <h1>Search {{ store.title }}</h1>
      <ptj-form-row v-for="field in store.data_template.cells" :key="field.meta.name" :field="field" :class="Class.getClass('ptj-filter-form-group')">
          <ptj-id v-if="field.meta.type=='id'" :filter="true" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :filter="true" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :filter="true" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" :filter="true" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :filter="true" :field="field" />
      </ptj-form-row>
      <input type="submit" value="Submit" :class="Class.getClass('ptj-filter-form-submit')" @click="slotScope.toggleWidget">
  </form>
 </ptj-widget>
</template>

<script>


import { defineComponent } from 'vue'
import PtjFormRow from "./ptj-form-row.vue"
import PtjId from "./ptj-id.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjTime from "./ptj-time.vue"
import PtjNumber from "./ptj-number.vue"
import PtjString from "./ptj-string.vue"
import PtjWidget from "./ptj-widget-window.vue"
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
      "ptj-form-row" : PtjFormRow,
      "ptj-id" : PtjId,
      "ptj-flag" : PtjFlag,
      "ptj-time" : PtjTime,
      "ptj-number" : PtjNumber,
      "ptj-string" : PtjString,
      "ptj-widget" : PtjWidget
    }
       
  
});
</script>
<style scoped>
.error {
  color : red;
}

</style>

