import { createRouter, createWebHistory } from "vue-router"
import { createI18n }  from "./js/i18n.js"
import PrimeVue from 'primevue/config';
import { registerFlow } from "./js/flows.js"
import { getClient } from "./js/client.js"
import PtjSingle from "./components/active/single.vue"
import PtjReport from "./components/reports/report.vue"
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
      croutes.push({ path : base + "/data/single/:model/:id?", component : PtjSingle, name : 'single', props : route => ({ model : route.params.model, base : base + "/" }) });
      croutes.push({ path : base + "/reports/:model/:id?", component : PtjReport, name : 'report', props : route => ({ model : route.params.model, id : route.params.id }) });
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

        const i18n = createI18n(options);
    
        app.provide("i18n", i18n.global );
        app.use(i18n);
        app.config.globalProperties.translate = i18n.global;

        app.use(PrimeVue);

        let client = getClient();
        app.provide("client", client);

        app.component("Controller", Controller);

    }
}


export {
  Controller,
  getClient,
  initConfigs
}

export * as Dispatch from "./components/dispatch/dispatch-response.vue"
export * as Filter from "./components/filter/filter.vue"
export * as Form from "./components/form/form.vue"
export * as slugtrail from "./components/slugtrail/slug-trail.vue"
export * as Login from "./components/login/login.vue"
export * as ViewField from "./components/view/view-field.vue"
export * as Tree from "./components/tree/tree.vue"
export * as Table from "./components/table/table-display.vue"
export * as Flow from "./components/flow/flow.vue"
export * as Report from "./components/reports/report.vue"
export { download } from "./js/exports/download.js"


