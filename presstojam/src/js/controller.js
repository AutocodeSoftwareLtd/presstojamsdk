import { createRouter, createWebHistory } from "vue-router"
import client from "./client.js"
import { createApp, reactive } from 'vue'
import PrimeVue from 'primevue/config';
import PtjAccountHandler from "./../components/ptj-account-handler.vue"
import PtjRoot from "./../components/ptj-root.vue"
import PtjRoute from "./../components/ptj-route.vue"
import Client from "./client.js"
import { setDictionary } from "./dictionary.js"

let settings = {};
let base = "/";
let router = null;
let routes = null;
let model_settings = {};
let init_redirect = false;

export const User = { login : false, user : "public" };

export const routeStore = reactive({
    to : '',
    from : '',
    route : null,
    settings : {}
});


export function createPtjRouter(routes) {
    router = createRouter({
        history: createWebHistory(),
        routes : routes
    });
}

export function reload() {
    location.href = base;
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

    return client.get("/slug/" + Map.route + "/" + Map.flow + "/" + Map.model, params)
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



export function logout() {
    Client.post("/core/logout")
    .then(() => {
        router.go();
    });
}


const user_check = 600000;

export function checkLoginStatus() {
    Client.get("/core/check-user")
    .then(response => {
        if (response.user != User.user) {
            throw "Incorrect user";
        }

        if (response.is_expired) {
            return Client.put("/core/switch-tokens")
            .then(() => {
                checkLoginStatus();
            });
        }
    }).then(response => {
        setTimeout(checkLoginStatus, user_check); 
    }).catch(e => {
        reload();
    });
}

function initUser() {
    return Client.get("/core/check-user")
    .then(response => {
        if (response.u == User.user) {
            return Client.get("/dictionary")
            .then(response => {
                setDictionary(response);
                return true;
            })
            .then(() => {
                return Client.get("/site-map")
                .then(response => {
                    routes = {};
                    for(let i in response) {
                        routes[base + i] = response[i];
                    }
                });
            });
        }
    }).catch(e => console.log(e));
}


function initRouter() {
    let croutes = [];
    if (!routes) {
        let uri = base + "user-login";
        init_redirect = uri;
        croutes = [{ path : uri, component : PtjAccountHandler, name : 'login' }, { path : base, redirect : uri}];
    } else {
        let def = null;
        for(let i in routes) {
            if (!def && !routes[i].parent) def = { path : base , redirect :i};
            croutes.push({ path : i, component : PtjRoute });
        }
        croutes.push(def);
    }
    router = createRouter({
        history: createWebHistory(),
        routes : croutes
    });

    router.beforeEach((to, from) => {
        if (routes) routeStore.route = routes[to.path];
        routeStore.to = to;
        routeStore.from = from;
        routeStore.settings = (model_settings[to.path]) ? model_settings[to.path] : {}; 
    });
}



export function PtjRun(profile, settings = {}) {
    if (!settings) settings = {};
    if (!settings.client) {
        throw "Must set client settings";
    }

    if (!settings.client.url) {
        throw("No URL defined for client");
    }

    if (settings.map && settings.map.base) {
        base = settings.map.base;
    }

    if (settings.models) {
        for(let i in settings.models) {
            model_settings[base + i] = settings.models[i];
        }
    }

    client.initSettings(settings.client);

    User.user = profile;
    
    return initUser()
    .then(() => {
        return initRouter()
    }).then(() => {
        const app = createApp(PtjRoot).use(PrimeVue).use(router);
        if (init_redirect) {
            router.replace({ path : init_redirect  });
        }
        return app;
    });
}
