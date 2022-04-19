<template>
    <div :class="Class.getClass('ptj-single-item') + ' ' + store.classes">
        <h1>{{ store.title }}</h1>
        <ptj-nav :actions="store.actions" :class="Class.getClass('ptj-single-item-actions')" />
        <ptj-form-row v-for="(field, index) in store.data.cells" :key="index" :field="field" :class="Class.getClass('ptj-single-item-row') + ' ' + field.name">
          <ptj-asset v-if="field.meta.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :field="field"  />
          <ptj-time v-else-if="field.meta.type=='time'" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :field="field"  />
        </ptj-form-row>
    </div>
    <ptj-nav :actions="store.children" :class="Class.getClass('ptj-single-item-children')" />
</template>

<script>
import { defineComponent  } from 'vue'
import PtjNav from "./ptj-nav.vue"
import PtjWidget from "./ptj-widget-window.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"
import PtjFormRow from "./ptj-form-row.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import PtjAsset from "./ptj-asset.vue"


export default defineComponent({
  name: 'ptj-single-item',
  props : {
      active : {
          type : Boolean,
          default : false
      }
  },
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
  computed : {
      editnav() {
          return this.store.actions.put;
      },
      delnav() {
          return this.store.actions.delete;
      },
      title() {
          return this.store.title + " " + this.store.summary();
      }
  },
  methods : {
      runDel() {
          this.store.runDelete();
      }
  },
  components : {
    "ptj-nav" : PtjNav, 
    "ptj-widget" : PtjWidget,
    "ptj-string" : PtjString,
    "ptj-time" : PtjTime,
    "ptj-asset" : PtjAsset,
    "ptj-id" : PtjId,
    "ptj-form-row" : PtjFormRow,
    "ptj-flag" : PtjFlag,
    "ptj-number" : PtjNumber
  }
});
    

</script>