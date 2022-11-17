import { createRouter, createWebHistory } from "vue-router"
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config';
import { createClient } from "./js/client.js"
import { registerFlow } from "./js/flows.js"
import { initConfigs } from "./js/configs.js"
import Controller from "./components/controller.vue"
import Model from "./components/model.vue"
import Login from "./components/login/login.vue"
import SiteMap from "./components/dev/sitemap.vue"
import MissingPage from "./components/statuspages/missing-page.vue"
import SetDefault from "./components/setdefault.vue"

export default {
    install : (app, options) => {
  
      initConfigs(options);

      const base = options.base;

      if (options.routes && !Array.isArray(options.routes)) {
          throw "Routes must be an array";
      }
      const croutes = (options.routes) ? options.routes : [];

      //add base
      for(let route of croutes) {
          route.path = base + route.path;
      }

      croutes.push({ path : base + "/user-login", component : Login, name : 'login', props : {}});
      croutes.push({ path : base + "/data/:model/:id?", component : Model, name : 'repo', props : route => ({ model : route.params.model, id : route.params.id })});
      croutes.push({ path : base + "/data/active/:model/:id", component : Model, name : 'primary', props : route => ({ model : route.params.model, is_active : true, id : route.params.id }) });
      //croutes.push({ path : base + "/flow/:flow/:position?", component : PtjFlow.vue, name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position) })});
      croutes.push({ path : base + "/dev/site-map", component : SiteMap, name : 'sitemap'});
      croutes.push({ path : base + "/", component : SetDefault, name : 'default'});
      croutes.push({ path : '/:pathMatch(.*)*', component: MissingPage });


        const router = createRouter({
            history: createWebHistory(),
            routes : croutes
        });

        app.use(router);
        app.provide("router", router);

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

        let messages = (options.i18n && options.i18n.messages) ? options.i18n.messages : {};
    
        const i18n = createI18n({
            locale: 'en',
            messages,
            silentTranslationWarn: true,
            legacy : false,
            dateTimeFormats
        });

        app.provide("i18n", i18n.global );
        app.use(i18n);
        app.config.globalProperties.translate = i18n.global;

        app.use(PrimeVue);

        let client = createClient();
        app.provide("client", client);

        app.component("Controller", Controller);

    }
}


export {
  Controller
}

