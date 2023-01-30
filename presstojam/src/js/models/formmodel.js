import configs from "./../configs.js"
import { getEntity } from "../entity/entitymanager.js"
import { getClient } from "./../client.js"
import { sortByDictionary, toReferenceTree } from "./../helperfunctions.js"


export class FormModel {

    constructor(name, id) {
        this._name = name;
        this._fields = {};
        this._id = id;
        this._editable_fields = [];
        this._parent = null;
        this._events;
        this._perms = [];
        


        const keys = Object.keys(this);
       
        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                   return this[property];
                },
                set: function(newValue) {
                    this[property] = newValue;
                }
            })
          }
        });

        const entity = this.loadEntity();
        this.loadSettings();
        this.loadFields(entity);
    }


    get children_models() {
        return this._fields["--id"].reference;
    }

   
    getSettings() {
        let settings = configs.get("models");
        if (settings[this._name]) {
            return settings[this._name];
        }
    }

    loadSettings() {
        const settings = this.getSettings();
        if (settings) {
            if (settings.editable) this._editable_fields = settings.editable;
        }
    }

    loadEntity() {
        const entity = getEntity(this._name);
        if (!entity) {
            throw "Can't create model from entity that doesn't exist ", this._name;
        } 

        if (entity.perms) this._perms = entity.perms;
        return entity;
    }


    loadFields(entity) {
        const fields = entity.cells;
        for(let i in fields) {
            if (!this._limited_fields || this._limited_fields.includes(slug + i)) {
                this._fields[i] = Object.assign(Object.create(fields[i]), fields[i]);
                this._fields[i].slug = i;
            }
        }
    }


    load() {
        const client = getClient();
        return client.get("/data/" + this._name + "/active", {"--id" : this._id});
    }


    trigger(key, data) {
        if (this._events[key]) {
            this._events[key](data);
        }
    }


    setEditableCells(schema = null) {
        if (!schema) schema = this._fields;
        for(let i in schema) {
            schema[i].disabled = false;

            if (schema[i].slug != schema[i].name) {
                schema[i].disabled = true; //continue - don't use includes or parents
                continue;
            }

            if (schema[i].system || schema[i].immutable) {
                schema[i].disabled = true; //continue - don't use includes or parents
                continue;
            }
                //check if limited

            if (this._editable_fields.length && !this._editable_fields.includes(i)) {
                schema[i].disabled = true;
                continue;
            }
    
    
            if (schema[i].type == "json") {
                this.setEditableCells(schema[i].fields);
            } 
        }
    }
    
    setCreateCells(schema = null) {
        if (!schema) schema = this._fields;
        for(let i in schema) {
            schema[i].disabled = false;

            if (schema[i].slug != schema[i].name) {
                schema[i].disabled = true; //continue - don't use includes or parents
                continue;
            }

            if (schema[i].system) {
                schema[i].disabled = true; //continue - don't use includes or parents
                continue;
            }

            if (schema[i].type == "json") {
                this.setCreateCells(schema[i].fields);
            } 
        }
    }

    getEnabledCells() {
      
        let cells = {};
        for(let i in this._fields) { 
            if (!this._fields[i].disabled) {
                cells[i] = this._fields[i];
            }
        }
        return cells;
    }


    getOptions(name, id) {
        const client = getClient();
        let url = "/reference/" + this._name + "/" + name;
        if (id) url += "/" + id;
        return client.get(url)
        .then(response => {
            response.sort(sortByDictionary);
           return response;
        });
    }


    
    getRecursiveOptions(name, id) {
        const client = getClient();
        let url = "/reference/" + this._name + "/" + name;
        if (id) url += "/" + id;
        return client.get(url)
        .then(response => {
            return toReferenceTree(response, this._fields)
        });
    }

}