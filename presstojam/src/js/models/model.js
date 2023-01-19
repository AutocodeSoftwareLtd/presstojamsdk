import configs from "./../configs.js"
import { getEntity } from "../entity/entitymanager.js"
import { ReferenceTypes } from "./../entity/id.js"
import { getClient } from "./../client.js"

export class Model {

    constructor(name) {
        this._name = name;
        this._fields = {};
        this._perms = [];
        this._import = false;
        this._export = false;
        this._max_cols = 8;
        this._no_filter = false;
        this._children = null;
        this._sort = null;
        this._to;
        this._group;
        this._order;
        this._params;
        this._limited_fields = null;
        this._export_fields;
        this._distinguish;
        this._audit;
        this._actions = [];
        this._editable_fields = [];
        this._classes;
        this._group_classes;
        this._events = {};
        


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
        this.loadParentFields();
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
            if (settings.to) this._to = settings.to;
            if (settings.perms) this._perms = settings.perms;
            if (settings.group) this._group = settings.group;
            if (settings.order) this._order = settings.order;
            if (settings.params) this._params = settings.params;
            if (settings.children) this._children = settings.children;
            if (settings.fields) this._limited_fields = settings.fields;
            if (settings.limit) this._limit = settings.limit;
            if (settings.export_fields) this._export_fields = settings.export_fields;
            if (settings.distinguish) this._distinguish = settings.distinguish;
            if (settings.actions) this._actions = settings.actions;
            if (settings.editable) this._editable_fields = settings.editable;
            if (settings.no_filter) this._no_filter = settings.no_filter;
            if (settings.max_cols) this._max_cols = settings.max_cols;
            if (settings.classes) this._classes = settings.classes;
            if (settings.group_classes) this._group_classes = settings.group_classes;
            if (settings.events) this._events = settings.events;
        }
    }

    loadEntity() {
        const entity = getEntity(this._name);
        if (!entity) {
            throw "Can't create model from entity that doesn't exist ", this._name;
        } 
        
        if (entity.perms) this._perms = entity.perms;
        if (entity.sort) this._sort = entity.sort;
        if (entity.audit) this._audit = entity.audit;
        if (entity.import) this._import = entity.import;
        if (entity.export) this._export = entity.export;

        return entity;
    }


    loadFields(entity, slug = "") {
        const fields = entity.cells;
        for(let i in fields) {
            if (!this._limited_fields || this._limited_fields.includes(slug + i)) {
                this._fields[slug + i] = fields[i];
                if (fields[i].type == "id" && fields[i].reference_type == ReferenceTypes.REFERENCE ) {
                    this.loadFields(getEntity(fields[i].reference), slug + i + "/");
                }
            }
        }
    }

    loadParentFields() {
        if (this._to) {
            let parent = this._parent;
            while(parent) {
                let entity = getEntity(parent);
                this.loadFields(entity, parent + "/");
                if (parent == this._to) break;
                parent = entity.parent;
            }
        }
    }

    loadCount(filters) {
        if (this._limit) {
            const client = getClient();
            return client.get("/count/" + this._name, this.buildParams(filters))
            .then(response => {
                return parseInt(response.count);
            });
        } else {
            return Promise.resolve(0);
        }
    }

    load(filters, page) {
        const client = getClient();
        return client.get("/data/" + this._name, this.buildParams(filters, page));
    }


    loadActive(filters) {
        const client = getClient();
        return client.get("/data/" + this._name + "/active", this.buildParams(filters));
    }

    loadFirst(filters) {
        const client = getClient();
        return client.get("/data/" + this._name + "/first", this.buildParams(filters))
    }


    buildParams(filters, page = 0) {
        let params = {};
        if (this._to) params.__to = this._to;
        if (this._group) params.__group = this._group;
        if (this._limited_fields) params.__fields = this._limited_fields;
     
        if (this._limit) {
            params.__offset = page;
            params.__limit = this._limit;
        }

        for(let i in filters) {
            params[i] = filters[i];
        }
        return params;
    }

    trigger(key, data) {
        if (this._events[key]) {
            this._events[key](data);
        }
    }
}