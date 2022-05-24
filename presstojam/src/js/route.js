import { reactive } from "vue"
import client from "./client.js"
import Settings from "./settings.js"
import { Map } from "./map.js"
import { setDictionary } from "./dictionary.js"

window.onpopstate = function() {
    Map.convertFromURL();
    runRoute();
}

export const RouteStore = reactive({ 
    component : '', 
    title : '',
    name : '',
    route : { "children" : [], parent : null, "perms" : []}, 
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


export function init() {
    let role = "";
    const settings = Settings.getSettings("mapper");
    if (settings) {
        Map.base = "/" + settings.base.replace(/^\/+|\/+$/g, '');
        if (settings.role) {
            role = settings.role;
        }
    }
    return Promise.resolve();
}


export function loadRoute() {
    return client.get("/nav/route-points/" + Map.route + "/" + Map.model)
    .then(response => {   
        RouteStore.route.children = response.children;
        RouteStore.route.perms = response.perms;
        RouteStore.route.parent = response.parent;
        RouteStore.title = response.title;
        RouteStore.name = response.name;
        setDictionary(response.dictionary);
        setComponent();
    })
    .catch(e => console.log(e));
}




export function refresh() {
    location.href = Map.base;
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
    if (Map.hasChange("model")) {
        return loadRoute()
    }
}
