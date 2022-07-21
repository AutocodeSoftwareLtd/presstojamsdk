<template>
    <div class="ptj-nav">
        <div v-for="(routes, title) in NavStore.cats" :key="title">
            <span v-if="routes.length > 1">{{ title }}</span>
            <ptj-button v-for="(route) in routes" :route="{ 'route' : route.route, 'model' : route.model, 'state':route.state, 'key' : 0}" :key="route.route">{{ route.route }}</ptj-button>
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted } from "vue"
import Client from "./../js/client.js"
import PtjButton from "./ptj-button.vue"


const NavStore = reactive({
    cats : {}, 
    routes : [], 
});


onMounted(() => {
return Client.get("/nav/site-map")
    .then(response => {
        for(let cat in response) {
            if (!response[cat]) {
                const route = { route : cat,  model : cat, state : null };
                NavStore.cats[cat] = [route];
            } else {
                for(let route_name in response[cat]) {
                    const route = { model : route_name, state : response[cat][route_name].state };
                    if (response[cat][route_name].default) route.default = true;
                    route.route = route_name;
                    NavStore.routes.push(route);

                    if (!NavStore.cats[cat]) NavStore.cats[cat] = [];
                    NavStore.cats[cat].push(route);
                }
            }
        }
    })
    .catch(e => {
        console.log(e);
    });
});
</script>