import configs from "./configs.js"
import { createRouter, createWebHistory } from "vue-router"
//import { registerFlow } from "./js/flows.js"
import PtjSingle from "./../components/active/single.vue"
import PtjReport from "./../components/reports/report.vue"
import Repo from "./../components/repo/repo.vue"
import Active from "./../components/active/active.vue"
import Account from "./../components/account/account.vue"
import SiteMap from "./../components/dev/sitemap.vue"
import MissingPage from "./../components/statuspages/missing-page.vue"
import SetDefault from "./../components/setdefault.vue"

export function createAppRouter() {
    const base = configs.get("base");
    const routes = configs.get("options.routes");
    
    if (routes && !Array.isArray(routes)) {
        throw "Routes must be an array";
    }
    
    const croutes = (routes) ? routes : [];

      //add base
    for(let route of croutes) {
        route.path = base + route.path;
    }

    croutes.push({ path : base + "/user-login", component : Account, name : 'login', props : {}});
    croutes.push({ path : base + "/data/:model/:id?", component : Repo, name : 'repo', props : route => ({ model : route.params.model, id : parseInt(route.params.id) })});
    croutes.push({ path : base + "/data/active/:model/:id", component : Active, name : 'primary', props : route => ({ model : route.params.model, is_active : true, id : parseInt(route.params.id) }) });
    croutes.push({ path : base + "/data/single/:model/:id?", component : PtjSingle, name : 'single', props : route => ({ model : route.params.model, base : base + "/" }) });
    croutes.push({ path : base + "/reports/:model", component : PtjReport, name : 'report', props : route => ({ model : route.params.model }) });
      //croutes.push({ path : base + "/flow/:flow/:position?", component : PtjFlow.vue, name : 'flow', props : route => ({ flow : route.params.flow, position : parseInt(route.params.position) })});
    croutes.push({ path : base + "/dev/site-map", component : SiteMap, name : 'sitemap'});
    croutes.push({ path : base + "/", component : SetDefault, name : 'default'});
    croutes.push({ path : '/:pathMatch(.*)*', component: MissingPage });


    const router = createRouter({
            history: createWebHistory(),
            routes : croutes
    });

    return router;

}