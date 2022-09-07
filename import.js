import { PtjRun } from "./presstojam/src/js/controller.js"
import Client from "./presstojam/src/js/client.js"
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'

 
export function PtjController(profile, settings) {
    return PtjRun(profile, settings);
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

