import Ctrl from "./presstojam/src/js/controller.js"
import PTJRoot from "./presstojam/src/components/ptj-root.vue"
import { createApp } from "vue"

function runApp(mount) {
    const app = createApp(PTJRoot);
    app.mount(mount);
    return app;
}

export default { 
    Ctrl, runApp
}


