import client from "./client.js"
import { createField } from "./meta/fieldfactory.js"

let settings = {};
let routes = {};


export function loadSiteMap() {
    return client.get("/user/site-map")
    .then(response => {
        for(let i in response) {
            response[i].name = i;
            const schema = response[i].schema;
            //set up some shortcuts
            if (schema['--parent']) {
                response[i].parent = schema['--parent'].reference;
            }
            response[i].children = schema["--id"].reference;
            response[i].sort = (schema["--sort"]) ? true : false;
            response[i].state_handlers = {};
            response[i].state_listeners = {}
            for (let x in schema) {
                const field = schema[x];
                response[i].schema[x] = createField(x, field, i);
                  
                if (field.states) {
                    response[i].state_listeners[x] = {};
                    for(const state of field.states) {
                        if (!response[i].state_handlers[state.depends_on]) response[i].state_handlers[state.depends_on] = [];
                        response[i].state_handlers[state.depends_on].push(response[i].schema[x]);
                        
                        response[i].state_listeners[x][state.depends_val] = function() {
                            return createField(x, field.states[state].data, i);
                        }
                    }
                }
            }

            response[i].settings = (settings[i]) ? settings[i] : {};
        }
        routes = response;
        return routes;
    });
}

export function getRoute(model) {
    if (!routes[model]) throw "Trying to find model " + model + " in routes that doesn't exists";
    return routes[model];
}

export function getRouteStructure(model) {
    let items = [];
    while(model) {
        const route = getRoute(model)
        items.push(route);
        model = route.parent;
    }
    return items.reverse();
}

export function getRoutes() {
    return routes;
}

export function setRouteSettings(route_settings) {
    settings = route_settings;
}

export function hasRoute(model) {
    return (routes[model]) ? true : false;
}


export function getField(name, schema) {
    let pts = name.split("/");
    let cell;
    for(let x=0, n=pts.length; x<n; ++x) {
        cell = schema[pts[x]];
        if (n > 1 && x < n - 1) {
            schema = routes[cell.reference].schema;
        }
    }
    return cell;
}
/*
setStates(fields) {
        for(let i in fields) {
            let groups = {};
            if (fields[i].states) {
                for(const state of fields[i].states) {
                    if (!groups[state.depends_on]) groups[state.depends_on] = [];
                    groups[state.depends_on].push(state); 
                }
            }
            this._state_groups[i] = groups;
        }
    }
*/