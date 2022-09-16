import client from "./client.js"
import { createField } from "./meta/fieldfactory.js"

let settings = {};
let routes = {};


export function loadSiteMap() {
    return client.get("/site-map")
    .then(response => {
        for(let i in response) {
            const schema = response[i].schema;
            //set up some shortcuts
            if (schema['--parent']) response[i].parent = schema['--parent'].reference;
            response[i].children = schema["--id"].reference;
            response[i].sort = (schema["--sort"]) ? true : false;
            let state_handlers = {};
            for (let x in schema) {
                const field = schema[x];
                response[i].schema[x] = createField(x, field, i);
                  
                if (field.states) {
                    for(const state of field.states) {
                        if (!state_handlers[state.depends_on]) state_handlers[state.depends_on] = [];
                        state_handlers[state.depends_on].push(response[i].schema[x]); 
                    }
                    response[i].schema[x].states = field.states;
                }
            }

            for(let x in state_handlers) {
                response[i].schema[x].state_handlers = state_handlers[x];
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