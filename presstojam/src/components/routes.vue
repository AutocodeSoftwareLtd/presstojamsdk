<template>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
         <component :is="Component" v-bind:atts="route.params" :key="route.model + route.id" />
      </transition>
   </router-view>
</template>
<script setup>

</script>
<style>
   .fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>