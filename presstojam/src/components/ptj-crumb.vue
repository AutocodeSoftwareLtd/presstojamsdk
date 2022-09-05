<template>
    <router-link :to="item.to" custom v-slot="{isActive, href, navigate, isExactActive}">
        <a 
            :class="{'active-link': isActive}" 
            class="p-menuitem-link"
            :href="href"
            @click="navigate"
            @mouseover="toggleInfo" 
            @mouseout="toggleInfo"><i v-if="item.icon" class="pi" :class="item.icon"></i><span class="p-menuitem-text">{{item.label}}</span></a>
    </router-link>
    <OverlayPanel ref="info" appendTo="body" v-if="item.info">
        <div>
           <div v-for="row in item.info">
            <span>{{ row.label }}</span> <span>{{ row.value }}</span>
           </div>
        </div>
    </OverlayPanel>
</template>
<script setup>

import OverlayPanel from 'primevue/overlaypanel';
import { ref } from "vue"

const props = defineProps({
    item : Object
});

const info = ref();

function toggleInfo(e) {
    if (props.item.info) info.value.toggle(e);
}

</script>