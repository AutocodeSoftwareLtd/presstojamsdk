<template>
    <div class="ptj-slug-trail">
        <ptj-button v-for="trail in RouteStore.slug" :key="trail.id" :route="trail.route">{{ trail.model }}</ptj-button>
    </div>
</template>
<script setup>
import PtjButton from "./ptj-button.vue"
import { RouteStore } from "./../js/route.js"



</script>