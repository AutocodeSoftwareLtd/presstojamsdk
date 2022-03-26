<template>
  <span :class="Class.getClass('ptj-nav') + ' ' + classes">
  <a v-for="route in actions" v-bind:key="route" @click="setRoute(route);" :class="Class.getClass('ptj-nav-link')">
    {{ route.n }}
  </a> 
  </span>
</template>

<script>
import { defineComponent } from 'vue'
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-nav',
  props: {
    actions : Array,
    classes : {
        type : String,
        default : ""
    }
  },
  setup() {
       return { Class };
  },
  methods : {
      setRoute(route) {
          route.r();
          Ctrl.buildLink();
      }
  }   
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>