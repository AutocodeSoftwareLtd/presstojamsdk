<template>
    <Steps :model="items" />

</template>
<script setup>
import Steps from 'primevue/steps';
import { getFlow } from "./../js/flows.js"

const props = defineProps({
    flow : String,
    position : Number
});

const flowObj = getFlow(props.flow);

const items = [];
const routes = flowObj.routes;
for(const i in routes) {
    const route = routes[i];
    items.push({ label : route.model, to : '/flows/' + props.flow + "/" + i});
}

</script>