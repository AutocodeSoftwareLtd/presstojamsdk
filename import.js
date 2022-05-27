import PTJUser from "./presstojam/src/components/ptj-user.vue"
import PTJRoute from "./presstojam/src/components/ptj-router.vue"
import { PtjRun } from "./presstojam/src/js/controller.js"
import Client from "./presstojam/src/js/client.js"
import { createApp } from "vue"
import { Map } from "./presstojam/src/js/map.js"
import { loadNav } from "./presstojam/src/js/user.js"
 
export function runApp(mount, user_settings) {
    PtjRun(user_settings)
    .then(() => {
        return loadNav()
    }).then(() => {
        const app = createApp(PTJUser);
        app.mount(mount);
        return app;
    }).catch(e => {
        console.log(e);
    });
}

export function runRoute(mount, user_settings) {
    PtjRun(user_settings)
    .then(() => {
        const app = createApp(PTJRoute);
        app.mount(mount);
        return app;
    }).catch(e => {
        console.log(e);
    });
}


export function getClient(settings) {

    if (!settings.client) {
        throw "Must set client settings";
    }

    if (!settings.client.url) {
        throw("No URL defined for client");
    }

    Client.initSettings(settings.client);
    return Client;
}

