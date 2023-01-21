<template>
    <Dialog v-model:visible="dialogswitch" :header="header" :modal="true" class="p-fluid">
        <component :is="c" v-bind="args" /> 
    </Dialog>
</template>
<script setup>
import { computed, onBeforeUnmount } from "vue"
import Dialog from 'primevue/dialog'
import { dialogswitch, component, args, header } from "./../../js/bus/dialog.js"
import { subscribe, unsubscribe } from "./../../js/bus/bus.js"

let c = computed(() => {
    return component.value;
});

subscribe("dialog_close", 1, function() {
    dialogswitch.value = false;
});


onBeforeUnmount(() => {
    unsubscribe("dialog_close", 1);
});
</script>