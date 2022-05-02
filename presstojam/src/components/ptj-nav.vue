<template>
  <span class="ptj-nav">
  <a v-for="route in actions" v-bind:key="route" @click="$emit('click', route)" class="ptj-nav-link">
    {{ route.n }}
  </a> 
  </span>
</template>

<script setup>

defineProps({
    actions : Object
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>