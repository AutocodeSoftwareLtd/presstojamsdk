import { PtjRun } from "./presstojam/src/js/controller.js"
import { Client } from "./presstojam/src/js/client.js"
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'

 
export function PtjController(profile, settings) {
    return PtjRun(profile, settings);
}


export function PtjClient(settings) {
    return new Client(settings.url, settings.custom_headers);
}
