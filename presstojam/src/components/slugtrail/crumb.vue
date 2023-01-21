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
        <dl v-for="row in item.info">
           <div  class="row">
            <dt>{{ row.label }}</dt> <dd>{{ row.value }}</dd>
           </div>
        </dl>
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
    if (props.item && props.item.info && info.value) info.value.toggle(e);
}

</script>
<style scoped>
    dl {
        position : relative;
        display: flex;
        flex-direction: column;
    }
    dt {
        float : left;
        font-weight : 700;
        width : 50%

    }
    dd {
        position : relative;
        margin-left : 50%;
        padding : 2px;
    }
    dl > div {
        position : relative;
        clear : both;
        display : block;
    }
</style>