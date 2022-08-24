import { createRouter, createWebHistory } from "vue-router"
import client from "./client.js"

export function loadRoute() {
    RouteStore.component = "";
    RouteStore.route.children = [];
    RouteStore.route.parent = null;
    RouteStore.route.perms = [];
    RouteStore.route.title = "";
    RouteStore.route.name = "";
    RouteStore.sort = false;
    return client.get("/route/" + Map.route + "/" + Map.flow + "/" + Map.model)
    .then(response => {   
        RouteStore.route.children = response.children;
        RouteStore.route.perms = response.perms;
        RouteStore.route.parent = response.parent;
        RouteStore.title = response.title;
        RouteStore.name = response.name;
        if (response.sort) RouteStore.sort = true;
        setComponent();
    })
    .then(response => {

    })
    .catch(e => console.log(e));
}