<template>
    <Dialog v-model:visible="dialogswitch" :header="header" :modal="true" class="p-fluid">
        <component :is="component" v-bind="args" /> 
    </Dialog>
</template>
<script setup>
import { shallowRef, ref, onBeforeUnmount } from "vue"
import Dialog from 'primevue/dialog'
import { subscribe, unsubscribe } from "./../../js/bus/bus.js"


const component = shallowRef(null);
const args = ref({});
const dialogswitch = ref(false);
const header = ref('');



subscribe("dialog_open", 1, (in_component, in_args, input_header) => {
    dialogswitch.value = true;
    header.value = input_header;
    component.value = in_component;
    args.value = in_args;
});

subscribe("dialog_close", 1, function() {
    dialogswitch.value = false;
    header.value = null;
    component.value = null;
    args.value = null;
});


onBeforeUnmount(() => {
    unsubscribe("dialog_close", 1);
    unsubscribe("dialog_open", 1);
});
</script>