import { createRouter, createWebHistory } from "vue-router"
import { createApp, defineAsyncComponent } from 'vue'
import PrimeVue from 'primevue/config';
import PtjAccountHandler from "./../components/ptj-account-handler.vue"
import PtjRoot from "./../components/ptj-root.vue"
import PtjRepo from "./../components/ptj-repo.vue"
import PtjActive from "./../components/ptj-active.vue"
import PtjFlow from "./../components/ptj-flow.vue"
import PtjMissingPage from "./../components/ptj-missing-page.vue"
import PtjSitemap from "./../components/dev/ptj-sitemap.vue"
import { createClient } from "./client.js"
import { setRouteSettings, hasRoute, loadSiteMap } from "./routes.js"
import { createI18n } from 'vue-i18n'
import { createDataStore, clearDataCache } from "./datastore.js"
import { registerFlow } from "./flows.js"
import { clearStores } from "./reactivestores.js";
import { createUser, isUserAuthenticated } from "./user.js"
import { setSettings } from "./configs.js"



let base = "";
const container = {};



export function reload() {
    location.href = base;
}



function initRouter(app, client, base, routes) {

    if (routes && !Array.isArray(routes)) {
        throw "Routes must be an array";
    }
    const croutes = (routes) ? routes : [];

    //add base
    for(let route of croutes) {
        route.path = base + route.path;
    }

    croutes.push({ path : base + "/user-login", component : PtjAccountHandler, name : 'login', props : { base : base + "/"}});
    croutes.push({ path : base + "/data/:model/:id?", component : PtjRepo, name : 'repo', props : route => ({ model : route.params.model, base : base + "/" })});
    croutes.push({ path : base + "/data/active/:model/:id", component : PtjActive, name : 'primary', props : route => ({ model : route.params.model, base : base + "/" }) });
    croutes.push({ path : base + "/flow/:flow/:position?", component : PtjFlow, name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position), base : base + "/" })});
    croutes.push({ path : base + "/dev/site-map", component : PtjSitemap, name : 'sitemap'});
    croutes.push({ path : '/:pathMatch(.*)*', component: PtjMissingPage });


    let router = createRouter({
        history: createWebHistory(),
        routes : croutes
    });

    return client.get("/user/site-map")
    .then(response => {
        return loadSiteMap(response);
    })
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
            clearStores();

            if(to.name == "login" || to.name == "error404") {
                return true;
            }
            
            if (!isUserAuthenticated()) {
                return { name : "login"};
            }

            if (to.name == "primary" || to.name == "repo") {
                if (!hasRoute(to.params.model)) {
                    return { name : "error404" };
                }

                if (to.params.store) {
                    return true;
                }
              
                if (to.name == "primary") {
                    const store = createDataStore(client, to.params.model);
                    for(const child of store.route.schema["--id"].reference) {
                        const child_store = createDataStore(client, child);
                        child_store.parent_id = to.params.id;
                    }
                    
                    store.active_id = to.params.id;
                    return true;
                } else {
                    const store = createDataStore(client, to.params.model);
                    store.parent_id = to.params.id;
                   
                    return true;
                }
            }
            
            return true;
        });

        app.use(router);
        container.router = router;
    });
}

function initFlows(routes) {
    for(const route of routes) {
        registerFlow(route);
    }
}

function initIl8n(app, client) {
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

  
    return client.get("/user/dictionary")
    .then(messages => {
        const i18n = createI18n({
            locale: 'en',
            messages,
            silentTranslationWarn: true,
            legacy : false,
            dateTimeFormats
        });
        app.use(i18n);
        container.i18n = i18n;
    });
}



export function PtjRun(profile, settings = {}) {
    if (!settings) settings = {};

    setSettings(settings);
   
    //set up plugins and defaults
    const app = createApp(PtjRoot).use(PrimeVue);
    app.provide("profile", profile);

    let client = createClient(app, settings.client);
    container.client = client;
  
    return createUser(client, profile, settings.map.base)
    .then(() => {
        return initIl8n(app, client);
    }).then(() => {
        if (settings.map && settings.map.base) {
            base = settings.map.base.replace(/\/+$/, '');
        }
        return initRouter(app, client, base, settings.routes);
    })
    .then(() => {
        if (settings.flows) initFlows(settings.flows);
    })
    .then(() => {
        container.app = app;
        container.mount = function(selector) {
            this.app.mount(selector);
        }

        app.component('ptj-dispatch', defineAsyncComponent(() => {
            import ('./../components/ptj-dispatch-response.vue');
        }));

        return container;
    })
    .catch(e => {
         console.log(e);
    });
}
