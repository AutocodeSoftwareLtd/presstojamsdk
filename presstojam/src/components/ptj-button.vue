<template>
  <a class="ptj-button" :key="route" @click="run">
    <slot />
  </a> 
</template>

<script setup>


import { redirect } from "./../js/route.js"
import { Map } from "./../js/map.js"

const props = defineProps({
    route : Object
});


function run() {
    for(let i in props.route) {
        if (props.route[i] !== null) Map[i] = props.route[i];
    }
    Map.params = {};
    redirect();
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>