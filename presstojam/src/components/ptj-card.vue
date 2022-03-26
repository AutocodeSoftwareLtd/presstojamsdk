<template>
    <ptj-widget :title="title" :active="active">
        <div :class="classes">
            <a @click="next"><span class="material-icons">view_carousel</span></a>
            <div v-for="(field, index) in store.fields" :key="index" :class="rowclass + ' ' + field.name">
                <span :class="labelclass">{{ field.label }}</span>&nbsp;<span :class="rowclass">{{ field.val }}</span>
            </div>
        </div>
    </ptj-widget>
</template>

<script>
import { defineComponent  } from 'vue'
import GCWidget from "./ptj-widget-window.vue"
import Class from "../js/classinjection.js"
import Ctrl from "../js/controller.js"

export default defineComponent({
  name: 'ptj-card',
  props : {
      store : Object,
      active : {
          type : Boolean,
          default : false
      }
  },
  methods : {
      next() {
          this.store.next();
          Ctrl.buildLink();
      }
  },
  computed : {
      title() {
          return this.store.title;
      },
      classes() {
          return Class.getClass("ptj-card")  + " " + this.store.classes;
      },
      rowclass() {
          return Class.getClass("ptj-card-row");
      },
      labelclass() {
          return Class.getClass("ptj-card-label");
      },
      valueclass() {
          return Class.getClass("ptj-card-value");
      }
  },
  components : {
    "ptj-widget" : GCWidget
  }
});
    

</script>