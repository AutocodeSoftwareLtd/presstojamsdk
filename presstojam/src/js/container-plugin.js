import { createRouter, createWebHistory } from "vue-router"
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config';
import { createClient } from "./client.js"
import { registerFlow } from "./flows.js"
import { initConfigs } from "./configs.js"
import PtjController from "./../components/ptj-controller.vue"
import PtjModel from "./../components/ptj-model.vue"
import PtjDispatch from "./../components/ptj-dispatch-response.vue"
import PtjAccountHandler from "./../components/ptj-account-handler.vue"
import PtjForm from "./../components/ptj-form.vue"
import PtjFilterForm from "./../components/ptj-filter-form.vue"
import PtjFilterField from "./../components/ptj-filter-field.vue"
import PtjSlugTrail from "./../components/ptj-slug-trail.vue"
import PtjViewField from "./../components/ptj-view-field.vue"
import PtjEditField from "./../components/ptj-edit-field.vue"


export default {
    install : (app, options) => {
   console.log("Are we being claled?");
      
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

      croutes.push({ path : base + "/user-login", component : () => import("./../components/ptj-account-handler.vue"), name : 'login', props : {}});
      croutes.push({ path : base + "/data/:model/:id?", component : () => import("./../components/ptj-model.vue"), name : 'repo', props : route => ({ model : route.params.model, id : route.params.id })});
      croutes.push({ path : base + "/data/active/:model/:id", component : () => import("./../components/ptj-model.vue"), name : 'primary', props : route => ({ model : route.params.model, is_active : true, id : route.params.id }) });
      croutes.push({ path : base + "/flow/:flow/:position?", component : () => import("./../components/ptj-flow.vue"), name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position) })});
      croutes.push({ path : base + "/dev/site-map", component : () => import("./../components/dev/ptj-sitemap.vue"), name : 'sitemap'});
      croutes.push({ path : '/:pathMatch(.*)*', component: () => import("./../components/ptj-missing-page.vue") });


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

        app.component("PtjController", PtjController);
        console.log("Going to register");

    }
}


export {
  PtjModel,
  PtjDispatch,
  PtjAccountHandler,
  PtjForm,
  PtjFilterForm,
  PtjFilterField,
  PtjSlugTrail,
  PtjViewField,
  PtjEditField,
  PtjController
}

