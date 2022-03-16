<template>
 <div :class="Class.getClass('ptj-accounthandler')">
    <h1>{{ store.title }}</h1>
    <ptj-form />
    <ptj-nav :action="store.actions" />
 </div>
</template>

<script>


import { defineComponent } from 'vue'
import GCForm from "./ptj-form.vue"
import GCNav from "./ptj-nav.vue"
import Ctrl from "../js/controller.js"
import Class from "./../js/classinjection.js"

 
export default defineComponent({
  name: 'ptj-login',
  setup() {
      let store = Ctrl.getStore()
      store.next = instance => {
           Ctrl.reloadFromBase(instance.next_profile);
      }
      return { store : store, Class }
  },
  components : 
    {
      "ptj-form" : GCForm, "ptj-nav" : GCNav
    }
});
</script>


