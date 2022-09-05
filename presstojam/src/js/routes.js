import client from "./client.js"
import { createField } from "./meta/fieldfactory.js"

let route_promise = null;
let settings = {};
let routes = {};

function init() {
    if (!route_promise) {
        route_promise = client.get("/site-map")
        .then(response => {
            for(let i in response) {
                const schema = response[i].schema;
                let state_handlers = {};
                for (let x in schema) {
                    const field = schema[x];
                    response[i].schema[x] = createField(x, field);
                  
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
        })
        .catch(e => console.log(e));
    }
    return route_promise;
}


export function getRoute(model) {
    return init()
    .then(routes => {
        if (!routes[model]) throw "Trying to find model in routes that doesn't exists";
        return routes[model];
    })
    .catch(e => console.log(e));
}

export async function getRouteStructure(model) {
    let items = [];
    while(model) {
        await getRoute(model)
        .then(route => {
            items.push(route);
            model = route.parent;
        })
        .catch(e => {
            model = null;
        });
    }
    return items.reverse();
}

export function getRoutes() {
    return init();
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