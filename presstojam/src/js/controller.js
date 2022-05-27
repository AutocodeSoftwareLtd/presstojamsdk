let settings = {};
import client from "./client.js"
import { Map } from "./map.js"
import { initUser } from "./user.js"
import { initSettings} from "./route.js"


export function PtjRun(settings) {
    if (!settings.client) {
        throw "Must set client settings";
    }

    if (!settings.client.url) {
        throw("No URL defined for client");
    }

    client.initSettings(settings.client);

    if (settings.map) {
        Map.initSettings(settings.map);
    }

    initSettings(settings.models);

    let role = (settings.user && settings.user.role) ? settings.user.role : "";
    return initUser(role);
}
