import { reactive, defineAsyncComponent } from "vue"
import client from "./client.js"
import Settings from "./settings.js"
import { MapModel } from "./map.js"
import ModuleLoader from "./moduleloader.js"
import { setDictionary } from "./dictionary.js"

window.onpopstate = function() {
    Map.convertFromURL();
    runRoute();
}

export const RouteStore = reactive({ 
    cats : {}, 
    routes : [], 
    component : '', 
    title : '',
    name : '',
    route : { "children" : [], parent : null, "perms" : []}, 
});

export const Map = new MapModel();

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

    Map.convertFromURL();
    return Promise.resolve();
}

function getDefault() {
    for(let cat in RouteStore.cats) {
        for(let route of RouteStore.cats[cat]) {
            if (route.default) {
                return route;
            }
        }
    }
}


function load(response) {
    RouteStore.cats = {};
    RouteStore.routes = [];
    RouteStore.route = { "children" : [], parent : null, "perms" : []};
    RouteStore.model = null;
    return client.get("/nav/site-map")
    .then(response => {
        for(let cat in response) {
            for(let route_name in response[cat]) {
                const route = { model : route_name, state : response[cat][route_name].state };
                if (response[cat][route_name].default) route.default = true;
                route.route = route_name;
                RouteStore.routes.push(route);

                if (!RouteStore.cats[cat]) RouteStore.cats[cat] = [];
                RouteStore.cats[cat].push(route);
            }
        }
    });
}


function loadRoute() {
    return client.get("/nav/route-points/" + Map.route + "/" + Map.model)
    .then(response => {   
        RouteStore.route.children = response.children;
        RouteStore.route.perms = response.perms;
        RouteStore.route.parent = response.parent;
        RouteStore.title = response.title;
        RouteStore.name = response.name;
        setDictionary(response.dictionary);
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
    let promises = [];
    if (!Map.model) {
        promises.push(
            load()
            .then(() => {
                Map.apply(getDefault());
                return loadRoute();
            })
        );
    } else if (Map.hasChange("route")) {
      promises.push(load());
      promises.push(loadRoute());
    } else if (Map.hasChange("model")) {
        promises.push(loadRoute());
    }

    return Promise.all(promises)
    .then(() => {
        if (!Map.model) {
            
        }
        setComponent();
    })
    .catch(e => console.log(e));
}
