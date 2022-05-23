<template>
    <div class="ptj-nav">
        <div v-for="(routes, title) in RouteStore.cats" :key="title">
            <span v-if="routes.length > 1">{{ title }}</span>
            <ptj-button v-for="(route) in routes" :route="{ 'route' : route.route, 'model' : route.model, 'state':route.state, 'key' : 0}" :key="route.route">{{ route.route }}</ptj-button>
        </div>
    </div>
    <ptj-slug-trail />
    <Suspense>
        <template #default>
            <div :class="[Map.model, Map.state]">
            <ptj-button v-if="RouteStore.back" :route="RouteStore.back"><span class="material-icons">back</span></ptj-button>
            <h1>{{ RouteStore.title }}</h1>
            <component v-if="component" :is="component" />
            </div>
        </template>
        <template #fallback>
            <div>Loading ...</div>
        </template>
    </Suspense>
</template>
<script setup>

import { computed, defineAsyncComponent, onMounted } from "vue"
import PtjButton from "./ptj-button.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { init, RouteStore, runRoute } from "./../js/route.js"
import ModuleLoader from "./../js/moduleloader.js"


const component = computed(() => {
    if (!RouteStore.component) return null;
    else return defineAsyncComponent(() => ModuleLoader.loadModule(RouteStore.component));
});




onMounted(() => {
    init()
    .then(() => {
        return runRoute();
    });
});

</script>