<template>
    <div class="ptj-widget-window">
        <div class="ptj-widget-window-header">
            <h1 class="ptj-widget-window-title">{{ title }}
            <a class="ptj-widget-window-toggle" @click="toggleWidget"><span class="material-icons">more_horiz</span></a>
            </h1>
        </div>
        <div class="ptj-widget-window-body" v-show="show">
            <slot :toggleWidget="toggleWidget" />
        </div>
    </div>
</template>

<script setup>

import { ref } from "vue"

defineProps({
    title : String,
    active : {
        type : Boolean,
        default : false
    }
});

let show = ref(false);

function toggleWidget() {
    show.value = (show.value) ? false : true;
}

</script>