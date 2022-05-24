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

import { computed, onMounted } from "vue"
import PtjButton from "./ptj-button.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { init, RouteStore, runRoute } from "./../js/route.js"
import PtjRepo from "./ptj-repo.vue"
import PtjPrimary from "./ptj-primary.vue"
import PtjAccountHandler from "./ptj-account-handler.vue"


const component = computed(() => {
    if (!RouteStore.component) return null;
    else if (RouteStore.component == "ptj-primary") return PtjPrimary;
    else if (RouteStore.component == "ptj-repo") return PtjRepo;
    else if (RouteStore.component == "ptj-account-handler") return PtjAccountHandler;
});




onMounted(() => {
    init()
    .then(() => {
        return runRoute();
    });
});

</script>