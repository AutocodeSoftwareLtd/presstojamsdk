<template>
  <a class="ptj-button" :key="route" @click="run">
    <slot />
  </a> 
</template>

<script setup>


import { redirect, Map } from "./../js/route.js"

const props = defineProps({
    route : Object
});


function run() {
    for(let i in props.route) {
        Map[i] = props.route[i];
    }
    redirect();
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>