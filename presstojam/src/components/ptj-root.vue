<template>
   <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
         <div :key="route.path">
            <component :is="Component" />
         </div>
      </transition>
   </router-view>
</template>
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