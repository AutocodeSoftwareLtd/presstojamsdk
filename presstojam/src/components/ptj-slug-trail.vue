<template>
    <Breadcrumb :home="home" :model="crumbs">
        <template #item="{item}">
            <ptj-crumb :item="item" />
        </template>
    </Breadcrumb>
</template>
<script setup>
import { ref, computed } from "vue";

import Breadcrumb from 'primevue/breadcrumb';
import { getRouteStructure} from "./../js/routes.js"
import PtjCrumb from "./ptj-crumb.vue"
import { useI18n } from 'vue-i18n';


const { t } = useI18n();


const props = defineProps({
    model : String,
    store : Object,
    id : Number,
    base : String
});

const home = {icon: 'pi pi-home', to: props.base};

const routes = ref([]);

getRouteStructure(props.model)
.then(croutes => {
    routes.value = croutes;
});

function trailRouteInfo(trail, route) {
    let info = [];
    let summary = [];
    for(let i in trail[route.name]) {
        if (route.schema[i].background) continue;
        if (route.schema[i].summary) summary.push(trail[route.name][i]);
        info.push({label : t("models." + route.name + ".fields." + i + ".label"), value : trail[route.name][i]});
    }
    
    const label = (summary.length > 0) ? summary.join(" ") : route.name + " - " + trail[route.name]["--id"];
    return {
        label,
        info
    }
}

let crumbs = computed(() => {
    let arr = [];
    let trail = props.store.slug_trail;
    for(let route of routes.value) {
        if (!trail[route.name]) continue;
        //set multiple route
        const obj = { label : route.name, to : { name : "repo", params : { model : route.name } } };
        
        if (trail[route.name] && trail[route.name]["--parentid"]) obj.to.params.id = trail[route.name]["--parentid"]
        arr.push(obj);
        
        //set child route
        if (trail[route.name]) {
            const { label, info } = trailRouteInfo(trail, route);
            const obj = {
                label : label,
                to : { name : "primary", params : { model : route.name, id : trail[route.name]["--id"]} }
            }
            if (info.length > 0) obj.info = info;
            
            arr.push(obj);
        }
    }
    return arr;
});

</script>
<style scoped>
    .p-breadcrumb {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 1rem;
}
</style>