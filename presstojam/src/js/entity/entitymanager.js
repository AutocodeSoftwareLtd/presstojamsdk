import { Entity } from "./entity.js"
import { createField } from "./fieldfactory.js"

const _entities = {};

export function regEntity(i, entity) {
    _entities[i] = entity;
}

export function getEntity(i) {
    if (!_entities[i]) {
        console.warn("Trying to get entity " + i + " which isn't registerd in entity store", "entitystore.js");
    }
    return _entities[i];
}


export function getEntities() {
    return _entities;
}

export function loadSiteMap(response) {
    
    for(let i in response) {
        const entity = new Entity();
        entity.name = i;
        entity.audit = response[i].audit;
        entity.perms = response[i].perms;
        entity.import = response[i].import;
        entity.export = response[i].export;
        entity.min_rows = response[i].min_rows;
        entity.max_rows = response[i].max_rows;
        
        const schema = response[i].schema;

        //set up some shortcuts
        if (schema['--parent']) {
            entity.parent = schema['--parent'].reference;
        }
        entity.children = schema["--id"].reference;
        entity.sort = (schema["--sort"]) ? true : false;

        for (let x in schema) {
            //const field = schema[x];
            //if (settings[i] && settings[i][x]) {
                //setFieldSettings(field, settings[i][x]);
            //}

            entity.addCell(createField(x, schema[x], i));
        }

        regEntity(i, entity);
    }
}

export function hasEntity(name) {
    return (_entities[name]) ? true : false;
}

export function defaultEntity() {
    for(const name in _entities) {
        return name;
    }
}


export function getRoot(entity) {
    while(entity.parent) {
        entity = getEntity(entity.parent);
    }
    return entity;
}