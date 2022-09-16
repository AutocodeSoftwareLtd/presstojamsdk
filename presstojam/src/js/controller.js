import { createRouter, createWebHistory } from "vue-router"
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import PtjAccountHandler from "./../components/ptj-account-handler.vue"
import PtjRoot from "./../components/ptj-root.vue"
import PtjRepo from "./../components/ptj-repo.vue"
import PtjActive from "./../components/ptj-active.vue"
import PtjFlow from "./../components/ptj-flow.vue"
import PtjMissingPage from "./../components/ptj-missing-page.vue"
import Client from "./client.js"
import { setRouteSettings, hasRoute, loadSiteMap } from "./routes.js"
import { userSettings, initUser, isUserAuthenticated } from "./user.js"
import { createI18n } from 'vue-i18n'
import { createDataStore, clearDataCache, loadSlugTrail } from "./datastore.js"
import { registerFlow } from "./flows.js"

let base = "";

export function reload() {
    location.href = base;
}


function initRouter(app, base) {
    let router = createRouter({
        history: createWebHistory(),
        routes : [
            { path : base + "/user-login", component : PtjAccountHandler, name : 'login', props : { base : base + "/"}},
            { path : base + "/data/:model/:id?", component : PtjRepo, name : 'repo', props : route => ({ model : route.params.model, parentid : parseInt(route.params.id), base : base + "/" })},
            { path : base + "/data/active/:model/:id", component : PtjActive, name : 'primary', props : route => ({ model : route.params.model, id : parseInt(route.params.id), base : base + "/" }) },
            { path : base + "/flow/:flow/:position?", component : PtjFlow, name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position), base : base + "/" })}
        ]
    });


    return loadSiteMap()
    .then(routes => {
        let has_routes = false;
        let def = false;
        for(const i in routes) {
            if (!def && !routes[i].parent) def = { path : base + "/" , name : 'home', redirect : base + "/data/" + i};
            has_routes = true;
        }

        if (def) {
            router.addRoute(def);
        }


        router.addRoute({ path : base + "/error-404", component : PtjMissingPage, name : "error404"});

        router.beforeEach((to, from) => {
            clearDataCache();
            if (to.name != "login" && to.name != "error404") {
              if (!isUserAuthenticated()) {
                if (to.name != "login") {
                    return { name : "login"};
                }
              }

              if (to.name == "primary" || to.name == "repo") {
                if (!hasRoute(to.params.model)) {
                    return { name : "error404" };
                }

                if (to.params.store) {
                    return true;
                }
              
                const store = createDataStore(to.params.model);
            
                if (to.name == "primary") {
                    store.setParams({"--id" : to.params.id });
                    store.load()
                    .then(() => {
                        return loadSlugTrail(store);
                    })
                    .then(() => {
                        for(const child of store.route.schema["--id"].reference) {
                            const child_store = createDataStore(child);
                            child_store.parent_store = store;
                            child_store.setParams( {"--parent" : to.params.id});
                            child_store.load();
                        }
                    }).catch(e => console.log(e));
                    return true;
                } else {
                    store.setParams({"--parent" : to.params.id });
                    store.load()
                    .then(() => {
                        return loadSlugTrail(store);
                      })
                    .catch(e => console.log(e));
                    return true;
                }
              }
            } else {
                return true;
            }
        });

        app.use(router);
    });
}

function initFlows(routes) {
    for(const route of routes) {
        registerFlow(route);
    }
}

function initIl8n(app) {
    const dateTimeFormats = {
        'en': {
            short: {
              year: 'numeric',
              day: 'numeric',
              month: 'short',
              timeZone :'GMT'
            },
            long: {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric',
              timeZone :'GMT'
            }
          }
    }

    return Client.get("/dictionary")
    .then(messages => {
        const i18n = createI18n({
            locale: 'en',
            messages,
            silentTranslationWarn: true,
            legacy : false,
            dateTimeFormats
        });
        app.use(i18n);
    });
}


export function logout() {
    return Client.post("/core/logout")
    .then(() => {
        location.href = base + "/";
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

    if (settings.models) {
        setRouteSettings(settings.models);
    }

    Client.initSettings(settings.client);

    userSettings(profile);

    

    const app = createApp(PtjRoot).use(PrimeVue);
    return initUser()
    .then(() => {
        return initIl8n(app);
    }).then(() => {
        if (settings.map && settings.map.base) {
            base = settings.map.base.replace(/\/+$/, '');
        }
        return initRouter(app, base);
    })
    .then(() => {
        if (settings.flows) initFlows(settings.flows);
    })
    .then(() => {
        return app;
    })
    .catch(e => console.log(e));
}
