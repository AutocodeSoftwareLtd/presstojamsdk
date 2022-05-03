<template>
  <a class="ptj-button" :key="route" @click="redirect">
    <slot />
  </a> 
</template>

<script setup>

import Events from "./../js/events.js"
import { inject } from "vue"

const props = defineProps({
    route : Object
});

const map = inject("map");

function redirect() {
    let route = { ... props.route };
    route.target = 0;
    Events.trigger("redirect", { change : route, map });
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>