
import { createI18n }  from "./js/i18n.js"
import PrimeVue from 'primevue/config';

import { getClient } from "./js/client.js"
import { initConfigs } from "./js/configs.js"
import Controller from "./components/controller.vue"
import { createAppRouter } from "./js/router.js"

export default {
    install : (app, options) => {
        initConfigs(options);

        const router = createAppRouter();
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

export * as Filter from "./components/filter/filter.vue"
export * as Form from "./components/form/form.vue"
export * as slugtrail from "./components/slugtrail/slug-trail.vue"
export * as Account from "./components/account/account.vue"
export * as ViewField from "./components/view/view-field.vue"
export * as Tree from "./components/tree/tree.vue"
export * as Table from "./components/table/table-display.vue"
export * as Flow from "./components/flow/flow.vue"
export * as Report from "./components/reports/report.vue"
export { download } from "./js/exports/download.js"


