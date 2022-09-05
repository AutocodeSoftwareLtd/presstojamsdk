import { createRouter, createWebHistory } from "vue-router"
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import PtjAccountHandler from "./../components/ptj-account-handler.vue"
import PtjRoot from "./../components/ptj-root.vue"
import PtjRepo from "./../components/ptj-repo.vue"
import PtjPrimary from "./../components/ptj-primary.vue"
import PtjFlow from "./../components/ptj-flow.vue"
import PtjMissingPage from "./../components/ptj-missing-page.vue"
import Client from "./client.js"
import { getRoutes, setRouteSettings, hasRoute } from "./routes.js"
import { userSettings, initUser, isUserAuthenticated } from "./user.js"
import { createI18n } from 'vue-i18n'
import { createStore, clearDataCache } from "./datastore.js"
import { registerFlow } from "./flows.js"


export function reload() {
    location.href = base;
}


function initRouter(app, base) {
    let router = createRouter({
        history: createWebHistory(),
        routes : [
            { path : base + "/user-login", component : PtjAccountHandler, name : 'login', props : { base : base + "/"}},
            { path : base + "/data/:model/:id?", component : PtjRepo, name : 'repo', props : route => ({ model : route.params.model, parentid : parseInt(route.params.id) })},
            { path : base + "/data/active/:model/:id", component : PtjPrimary, name : 'primary', props : route => ({ model : route.params.model, id : parseInt(route.params.id) }) },
            { path : base + "/flow/:flow/:position?", component : PtjFlow, name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position) })}
        ]
    });


    return getRoutes()
    .then(routes => {
        let has_routes = false;
        let def = false;
        for(const i in routes) {
            if (!def && !routes[i].parent) def = { path : base + "/" , redirect : base + "/data/" + i};
            has_routes = true;
        }

        if (def) {
            router.addRoute(def);
        }


        router.addRoute({ path : base + "/error-404", component : PtjMissingPage, name : "error404"});

        router.beforeEach(async (to, from) => {
            clearDataCache();
            if (to.name != "login" && to.name != "error404") {
              if (!isUserAuthenticated()) {
                if (to.name != "login") {
                    return { name : "login"};
                }
              }

              if (to.name == "repo" || to.name == "primary") {
                if (!hasRoute(to.params.model)) {
                    return { name : "error404" };
                }

                if (to.params.store) {
                    return true;
                }

                let store = createStore(to.params.model, {"--id" : to.params.id })
                const res = await store.load()
                .then(() => {
                    return store.loadSlugTrail();
                })
                .then(() => {
                    if (to.name == "primary") {
                        let promises = [];
                        for(const child of store.store.route.children) {
                            const data_store = createStore(child, { "--parentid" : to.params.id });
                            promises.push(data_store.load());
                        }
                        return Promise.all(promises);
                    }
                }).catch(e => console.log(e));
                return true;
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
    return Client.get("/dictionary")
    .then(messages => {
        const i18n = createI18n({
            locale: 'en',
            messages,
            silentTranslationWarn: true,
            legacy : false
        });
        app.use(i18n);
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
        let base = "";
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
