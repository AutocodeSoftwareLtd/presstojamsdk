import PTJUser from "./presstojam/src/components/ptj-user.vue"
import Settings from "./presstojam/src/js/settings.js"
import { createApp } from "vue"

function runApp(mount, user_settings) {
    Settings.regSettings(user_settings);
    const app = createApp(PTJRoot);
    app.mount(mount);
    return app;
}

export default { 
    runApp
}


