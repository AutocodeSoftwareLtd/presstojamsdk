<template>
  <span :class="Class.getClass('ptj-breadcrumbs')">
  <a v-for="route in arr" v-bind:key="route" @click="setRoute(route.r);">
    {{ route.n }}
  </a> 
  </span>
</template>
<script>
import { defineComponent } from 'vue'
import Router from "../js/router.js"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-nav',
  props: {
    state : Object
  },
  setup() {
      return { Class }
  },
  methods : {
      setRoute(route) {
          Router.switchRoute(route);
      }
  },
  computed : {
      arr() {
         return Router.history;
      }
  }
   
});
</script>