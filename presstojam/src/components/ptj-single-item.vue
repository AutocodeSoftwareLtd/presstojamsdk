<template>
    <div :class="Class.getClass('ptj-single-item') + ' ' + store.classes">
        <h1>{{ store.title }}</h1>
        <ptj-nav :actions="store.actions" :class="Class.getClass('ptj-single-item-actions')" />
        <div v-for="(field, index) in store.data.cells" :key="index" :class="Class.getClass('ptj-single-item-row') + ' ' + field.name">
            <span :class="Class.getClass('ptj-single-item-label')">{{ field.meta.label }}</span>&nbsp;
            <span v-if="field.meta.ishtml" :class="Class.getClass('ptj-single-item-value')"  v-html="field.val"></span>
            <span v-else :class="Class.getClass('ptj-single-item-value')">{{ field.val }}</span>
        </div>
    </div>
    <ptj-nav :actions="store.children" :class="Class.getClass('ptj-single-item-children')" />
</template>

<script>
import { defineComponent  } from 'vue'
import GCNav from "./ptj-nav.vue"
import GCWidget from "./ptj-widget-window.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


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
    "ptj-nav" : GCNav, "ptj-widget" : GCWidget
  }
});
    

</script>