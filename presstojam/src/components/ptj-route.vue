<template>
 <router-view><component :is="component" /></router-view>
</template>
<script setup>

import PtjPrimary from "./../components/ptj-primary.vue";
import PtjTree from "./../components/ptj-tree.vue";
import PtjTable from "./../components/ptj-table.vue";
import PtjTreeChildren from "./../components/ptj-tree.vue";
import PtjTableChildren from "./../components/ptj-table.vue";
import { computed } from "vue"
import { routeStore } from './../js/controller.js'



function getComponent() {
    if (routeStore.route.children.length > 0) {
        if (routeStore.route.recursive) return PtjTreeChildren;
        return PtjTableChildren;
    } else {
        if (routeStore.route.recursive) return PtjTree;
        else return PtjTable;
    }
}


let component = computed(() => {
    return getComponent();
});




</script>