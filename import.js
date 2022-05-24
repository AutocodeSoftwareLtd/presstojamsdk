import PTJUser from "./presstojam/src/components/ptj-user.vue"
import PTJRoute from "./presstojam/src/components/ptj-router.vue"
import Settings from "./presstojam/src/js/settings.js"
import Client from "./presstojam/src/js/client.js"
import { createApp } from "vue"

function runApp(mount, user_settings) {
    Settings.regSettings(user_settings);
    const app = createApp(PTJUser);
    app.mount(mount);
    return app;
}

function runRoute(mount, user_settings) {
    Settings.regSettings(user_settings);
    const app = createApp(PTJRoute);
    app.mount(mount);
    return app;
}


function getClient(user_settings) {
    Settings.regSettings(user_settings);
    return Client;
}



export default { 
    runApp,
    runRoute,
    getClient
}


