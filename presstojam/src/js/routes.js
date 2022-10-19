import { Aggregate } from "./meta/aggregate.js";
import { createField } from "./meta/fieldfactory.js"
import { getClient } from "./client.js"

const client = getClient();


let settings = {};
let routes = {};


function setFieldSettings(field, settings) {
    for(let i in settings) {
        field[i] = settings[i];
    }
}



export function loadSiteMap(response) {
    for(let i in response) {
        response[i].name = i;
        const schema = response[i].schema;
        //set up some shortcuts
        if (schema['--parent']) {
            response[i].parent = schema['--parent'].reference;
        }
        response[i].children = schema["--id"].reference;
        response[i].sort = (schema["--sort"]) ? true : false;

        for (let x in schema) {
            const field = schema[x];
            if (settings[i] && settings[i][x]) {
                setFieldSettings(field, settings[i][x]);
            }

            response[i].schema[x] = createField(x, field, i);
        }

        response[i].settings = (settings[i]) ? settings[i] : {};
    }
    routes = response;
    return routes;
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


export function getSchema(name, schema) {
    let pts = name.split("/");
    let cell;
    for(let x=0, n=pts.length; x<n; ++x) {
        if (pts[x].indexOf("..") === 0) {
            //this is a reverse index
            const schema_name = pts[x].substring(2);
            if (!schema["--id"].reverse_references.includes(schema_name)) {
                throw schema_name + " does not exist as a reverse reference for: " + schema["--id"].model;  
            }
            schema = routes[schema_name];
            ++x;
            cell = schema[pts[x]];
        } else {
            cell = schema[pts[x]];
        }
         
        if (n > 1 && x < n - 1) {
            schema = routes[cell.reference].schema;
        }
    }
    return schema;
}




export function createView(model) {

    function getFields(fields, schema) {
        let obj = {};
        for(let field of fields) {
            if (typeof field === 'object') {
                if (field.path) {
                    const nschema = getSchema(field.path, schema);
                    let cobj = getFields(fields, nschema);
                    for(let i in cobj) {
                        obj[field.path + "/" + i] = cobj[i]; 
                    }
                } else if (field.type == "aggregate") {
                    obj[field.name] = new Aggregate(field);
                }
            } else {
                obj[field] = getField(field, route.schema);
            }
        }
        return obj;
    }


    let route = getRoute(model);
    if (route.settings.fields) {
        //this is a custom view,
        const croute = { ... route};
        croute.perms = ["get"]; //if custom route, can only view
        const schema = {};
        croute.schema = getFields(route.settings.fields, route.schema);
        return croute;
    } else {
        return route;
    }
}





export function createCustomStructure(route) {

    function getFieldStructure(fields, schema) {
        let obj = {};
        for(let field of fields) {
            if (typeof field === 'object') {
                if (field.path) {
                    const nschema = getSchema(field.path, schema);
                    obj[field.path + "/--id"] = nschema["--id"];
                    let cobj = getFields(fields, nschema);
                    for(let i in cobj) {
                        obj[field.path + "/" + i] = cobj[i]; 
                    }
                }
            }
            obj[field] = getField(field, route.schema);
        }
        return obj;
    }


    return getFieldStructure(route.settings.fields, route.schema);
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