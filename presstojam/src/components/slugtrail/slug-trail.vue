<template>
    <Breadcrumb :home="home" :model="crumbs">
        <template #item="{item}">
            <ptj-crumb :item="item" />
        </template>
    </Breadcrumb>
</template>
<script setup>
import { ref, computed, inject } from "vue";
import { rowToTree } from "../../js/helperfunctions.js"
import { getStore } from "../../js/data/storemanager.js"
import { getEntity } from "../../js/entity/entitymanager.js"
import configs from "../../js/configs.js"

import Breadcrumb from "primevue/breadcrumb"
import PtjCrumb from "./crumb.vue"


const Client = inject("client");
const i18n = inject("i18n");

const t = i18n.t;


const props = defineProps({
    name : String
});

const repo = getStore(props.name);
const store = repo.store;
const home = {icon: 'pi pi-home', to: configs.get("base")};

function getRoutes() {
    let entity = getEntity(store.name);
    let items = [];
    while(entity.parent) {
        const parent = getEntity(entity.parent);
        items.push(parent);
        entity = parent;
    }
    return items.reverse();
}

const routes = ref(getRoutes());

const slug_trail = ref(null);


if (store.parent) { 
    if (repo.active_id) {
        repo.load()
        .then(data => {
            const id = data['--parent'];
            return Client.get("/data/" + store.parent + "/active?__to=*&--id=" + id)
        }).then(response => {
            slug_trail.value = rowToTree(response, store.parent);
        }).catch(e => console.log(e));
    } else {
        const id = repo.parent_id;
        Client.get("/data/" + store.parent + "/active?__to=*&--id=" + id)
        .then(response => {
            slug_trail.value = rowToTree(response, store.parent);
        }).catch(e => console.log(e));
    }
} 
 

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
    if (!slug_trail.value) return arr;

    let trail = slug_trail.value;

    for(let route of routes.value) {
        if (!trail[route.name]) continue;
        //set multiple route
        const obj = { label : route.name, to : { name : "repo", params : { model : route.name } } };
        
        if (trail[route.name] && trail[route.name]["--parent"]) obj.to.params.id = trail[route.name]["--parent"]
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