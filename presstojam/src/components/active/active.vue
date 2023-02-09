<template>
  <div :class="model" class="gc-detail">
    <ptj-slug-trail :name="model" :store="active"/>
    <tab-active v-if="store.perms.includes('put')" :active="active" />
    <view-model v-else :active="active" />
  </div>
</template>
<script setup>
import { ActiveData } from "../../js/data/activedata.js"
import PtjSlugTrail from "./../slugtrail/slug-trail.vue"
import ViewModel from "./view-model.vue"
import TabActive from "./tab-active.vue"


const props = defineProps({
    model : String,
    id : Number
});

console.log("Model is", props.model);

const active = new ActiveData(props.model, props.id);
await active.load();
const store = active.model;




</script>