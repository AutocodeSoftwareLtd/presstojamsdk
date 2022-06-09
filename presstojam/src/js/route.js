import { reactive } from "vue"
import client from "./client.js"
import { Map } from "./map.js"


let model_settings = {};

window.onpopstate = function() {
    Map.reset();
    Map.convertFromURL();
    runRoute();
}

export const RouteStore = reactive({ 
    component : '', 
    title : '',
    name : '',
    route : { "children" : [], parent : null, "perms" : []}, 
    slug : [],
    sort : false
});

function setComponent() {
    if (Map.state == "get" || Map.state == "parent") {
        RouteStore.component = "ptj-repo";
    } else if (Map.state == "primary") {
        RouteStore.component = "ptj-primary";
    } else if (Map.state == "login") {
        RouteStore.component = "ptj-account-handler";
    }
}


export function initSettings(settings) {
    if (settings) model_settings = settings;
}


export function getModelSettings() {
    if (model_settings[Map.model] && model_settings[Map.model][Map.state]) {
        return model_settings[Map.model][Map.state];
    }
    return {};
}


export function loadRoute() {
    RouteStore.component = "";
    RouteStore.route.children = [];
    RouteStore.route.parent = null;
    RouteStore.route.perms = [];
    RouteStore.route.title = "";
    RouteStore.route.name = "";
    RouteStore.sort = false;
    return client.get("/nav/route-points/" + Map.route + "/" + Map.model)
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

export function loadSlugTrail() {
    RouteStore.slug = [];
    let params = {};
    if (Map.key) {
        if (Map.state == "parent") params["--parentid"] = Map.key;
        else if (Map.state == "primary") params["--id"] = Map.key;
    } else {
        return;
    }

    return client.get("/slug/" + Map.route + "/" + Map.model, params)
    .then(response => {
        RouteStore.slug = response;
        for(let i in RouteStore.slug) {
            i=parseInt(i);
            if (i > 0) {
                RouteStore.slug[i].route = {
                    model : RouteStore.slug[i].model,
                    state : 'parent',
                    key : RouteStore.slug[i].id
                }
            } else {
                RouteStore.slug[i].route = {
                    model : RouteStore.slug[i].model,
                    state : 'get',
                    key : 0
                }
            }
        }
    });
}


export function refresh() {
    if (location.href == Map.base) location.reload();
    else location.href = Map.base;
}

export function redirect() {
    addToHistory();
    runRoute();
}

export function addToHistory() {
    const url_str = window.location.protocol + "//" + window.location.host +  Map.convertToURL();
    const url = new URL(url_str);
    window.history.pushState({'name' : url.pathname}, document.title, url);
}

export function runRoute() {
    loadRoute();
    loadSlugTrail();
}
