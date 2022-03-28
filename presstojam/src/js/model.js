import client from "./client.js"
import { Field } from "./field.js"
import { reactive } from "vue"
import { Asset } from "./asset.js"
import { DataCell } from "./data.js"


export class Model {
    constructor() {
        this._active_children = [];
        this._active_state;
        this._change_intention;
        this._children = [];
        this._circular;
        this._default_state;
        this._key_states = { parent_key : null, primary_key : null };
        this._name;
        this._parent_key;
        this._primary_key;
        this._settings = {};
        this._states = {};
        this._main_model;
        this._to;
    
        this.store = reactive({
            fields : {},
            parent_models : [],
            label : '',
            title : '',
            data : [],
            component : '',
            rawcomponent : '',
            actions : [],
            next : null,
            index : '',
            primarykeyname : '',
            parentkeyname : '',
            circular : '',
            model :  this._name,
            siblings : [],
            children : [],
            stage : 0,
            groups : [],
            classes : ""
        });
    }

    get name() {
        return this._name;
    }

    get currentstate() {
        return (this._active_state) ? this._active_state : this._default_state;
    }


    get children() {
        return this._children;
    }

    get siblings() {
        if (this._siblings.length > 1) return this._siblings;
        else return [];
    }

    set state(state) {
        this._active_state = (state) ? state : this._default_state;
        this._change_intention = null;
        this.store.settings = { "fields" : null};
        if (this._settings[this._active_state]) this.store.settings = this._settings[this._active_state];
        this.applySettings();
        this.loadState();
    }

    set groups(groups) {
        this.store.groups = groups;
    }

    get main_model() {
        return this._main_model;
    }

    set main_model(model) {
        this._main_model = model;
    }

    get key() {
        if (this._active_state == "post" || this._active_state == "get") {
            return this._key_states.parent_key;
        } else {
            return this._key_states.primary_key;
        }
    }

    set to(to) {
        this._to = to;
    }

    set key(key) {
        if (this._active_state == "get" || this._active_state == "post") {
            this._key_states.parent_key = key;
        } else {
            this._key_states.primary_key = key;
        }

        if (this._active_state == "post" || this._active_state == "put") {
            for(let name in this.store.fields) {
                if (this.store.fields[name].on && this.store.fields[name].type == "select") {
                    this.store.fields[name].setOptions(this.params);
                }
            }
        }
    }

    set stage(stage) {
        this.store.stage = stage;
    }

    set name(name) {
        this._name = name;
    }

    set change_intention(intention) {
        this._change_intention = intention;
    }

    injectCustomSettings(settings) {
        this._settings = settings;
    }

    snakeCase(name) {
        return name.replace("-", "_");
    }

 
    get loadurl() {
        let url = "/" + this._name;
        if (this._active_state == "getprimary" ||  this._active_state == "put") url += "-primary";
        return url;
    }

    get saveurl() {
        let url = "/" + this._name;
        return url;
    }

    get params() {
        let params = {};
        if (this._active_state == "get" || this._active_state == "post") {
            if (this._key_states.parent_key) {
                params[this._parent_key] = this._key_states.parent_key;
            }
        } else if (this._active_state == "put" || this._active_state == "getprimary" || this._active_state == "delete") {
            params[this._primary_key] = this._key_states.primary_key;
        }
        if (this.to) params.__to = this.to;
        return params;
    }

    get classes() {
        return this._name.replace("_", "-") + " " + this._state;
    }

    get to() {
        return this._to;
    }

    get state() {
        return this._active_state;
    }

    get parentkey() {
        return this._parent_key;
    }

    get primarykey() {
        return this._primary_key;
    }

    get index() {
        return this._name + "-" + this._active_state;
    }

    get stage() {
        return this.store.stage;
    }

    get change_intention() {
        return this._change_intention;
    }

    get map() {
        return {
            model : this._name,
            key : this.key,
            state : this._active_state,
            to : this.to,
            stage : this.stage
        }
    }

    getSummary(field, data) {
        let sum = [];
        for(let tb in data[field.reference]) {
            sum.push(data[field.reference][tb]);
        }
        return sum.join(" ");
    }

    applySettings() {
        if (this.store.settings) {
            
            if (this.store.settings.groups) {
                this.store.groups = this.store.settings.groups;
            }

            if (this.store.settings.disable_filter) {
                this.store.disable_filter = true;
            }

            if (this.store.settings.disable_selectfields) {
                this.store.disable_selectfields = true;
            }
        }
    }

    buildIntention(state, key = null) {
        if (!key) key = this._key;
        this._change_intention = {state : state, key : key, target : 0};
        if (this.store.settings && this.store.settings.change_intention) {
            for(let setting in this.store.settings.change_intention) {
                this._change_intention[setting] = this.store.settings.change_intention[setting];
            }
        }
    }

    mapResponse(response) {
        this._name = response.model;
        this.store.model = this._name;
        this._primary_key = response.primarykey;
        this._parent_key = response.parentkey;
        this._children = response.children;
        this.store.children = [];
        for(let child of response.children) {
            this.store.children.push({ r : () => {
                this.buildIntention("get", this._key_states.primary_key);
                this._change_intention.model = child.name;
            }, n : child.label });
        }

        this.store.siblings = [];
        for(let sibling of response.siblings) {
            this.store.siblings.push({ r : () => {
                this.buildIntention("get", this._key_states.parent_key);
                this._change_intention.model = sibling.name;
            }, n : sibling.label });
        }

        this._circular = response.circular;

        this.store.primarykeyname = response.primarykey;
        this.store.parentkeyname = response.parentkey;
        this.store.circular = response.circular;

        //build parent states
        this.store.fields = {};
        for (let i in response.fields) {
            this.store.fields[i] = new Field(i, response.fields[i]);
            if (this.store.fields[i].type == "asset") {
                let asset = new Asset();
                asset.url = this._name + "-" + i;
                asset.keyfield = this.store.primarykeyname; 
                this.store.fields[i].asset = asset;
            } 
        }

        this._states = response.states;
        this._default_state = response.default_state;

        let par = response.to;
        while(par) {
            let pmodel = new Model({ model : par.model, key : 0 });
            pmodel.mapResponse(par);
            pmodel.main_model = this;
            pmodel.state = "getprimary";
            this.store.parent_models.push(pmodel);
            par = par.to;
        }
    }


    load() {
        this.store.data = [];
        for(let field in this.store.fields) {
            this.store.fields[field].val = null;
        }
        if (this._active_state == "get") {
            return client.get(this.loadurl, this.params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                this.mapRepoData(response);
                return response;
            });
           

        } else if (this._active_state == "getprimary" || this._active_state == "put") {
            return client.get(this.loadurl, this.params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                
                    this.mapData(response);

                    for(let parent of this.store.parent_models) {
                        if (response[parent.name]) {
                                //need to set the field data for this
                            parent.mapData(response[parent.name]);
                        }
                    }
            });
        } else if (this._active_state == "post" && this.store.parent_models.length > 0) {
            let parent = this.store.parent_models[0];
            parent.keymanager = this._key_states.parent_key;
            parent.to = this.to;
            return client.get(parent.loadurl, parent.params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                let parent = this.store.parent_models[this.store.parent_models.length - 1];
                parent.mapData(response);
                for(let parent of this.store.parent_models) {
                    parent.mapData(response[parent.name]);
                }
            })
            .catch(e => {
                console.log(e);
            });
        } else {
            return Promise.resolve();
        }
    }


    rLoadObj(data) {
        let obj={};
        for(const field in this.store.fields) {
            obj[field] = (this.store.fields[field].reference) ? new DataCell(data[field], this.getSummary(this.store.fields[field], data)) : new DataCell(data[field]);
        }
        if (this._circular && data[this._name]) {
            if (data[this._name]) {
                obj[this._name] = [];
                for(const i in data[this._name]) {
                    obj[this._name].push(this.rLoadObj(data[this._name][i]));
                }
            }
        }

        for(const i in this._active_children) {
            const name = this._active_children[i];
            if (data[name]) {
                obj[name] = [];
                for(const x in data[name]) {
                    obj[name].push(this.rLoadObj(data[name][x]));
                }
            }
        }
        return obj;
    }

    indexData(data) {
        let indexes = {};
        for(const key in data) {
            const row = data[key];
            for(let group of this.store.groups) {
                group = this.snakeCase(group);
                if (!indexes[group]) indexes[group] = {};
                let ckey = row[group].val;
                if (!indexes[group][ckey]) {
                    indexes[group][ckey] = {"display": "", "contains":[]};
                    indexes[group][ckey].display= row[group].display;
                }
                indexes[group][ckey].contains.push(key);
            }
        }
        return indexes;
    }

    mapRepoData(response) {
        this.store.data = [];
        for (const i in response.__data) {
            const data = this.rLoadObj(response.__data[i]);
            this.store.data.push(data);
            for(let x in this.store.parent_models) {
                let parent = this.store.parent_models[x];
                parent.mapData(response.__data[i][parent.name]);
            }
        }

        
        //now we need to group the data by
        this.store.indexes = this.indexData(this.store.data);
    }

    mapData(data) {
        for(const i in this.store.fields) {
            this.store.fields[i].val = (data[i]) ? data[i] : null;
        }
    }

    buildlink = (state) => {
        return () => {
            this.buildIntention(state);
        }
    }


    loadState() {
        this.store.actions = [];
        this.store.component = "";
        this.store.rawcomponent = "";
        this.store.data = [];
        this.store.title = this._states[this._active_state].title;
        this.store.label = this._states[this._active_state].label;
        this.store.action = this._active_state;
        this.store.method = this.store.action;
        this.store.submiturl = this.saveurl;
        this.store.classes = this._name + " " + this._active_state;
        if (!this.store.settings) this.store.settings = {};
        this.store.primarykey = () => {
            return this._key_states.primary_key;
        }

        this.store.addKeys = () => {};
        this.store.resolveKeys = () => {};
    
        let states = {
            'get': () => {
                this.store.actions = [];
                if (this._states.post) {
                    this.store.actions.push({ r: this.buildlink("post"), n: this._states.get.actions.post });
                }

                this.store.rawcomponent = (this.store.groups.length > 0) ? "ptj-list" : (this._circular || this._active_children.length > 0) ? "ptj-tree" : "ptj-table";
                /*
                if (this._states.getprimary) {
                    actions.getprimary = { r : this.buildlink("getprimary", params), n : this._states.getprimary.label };
                } else {
                    if (this._states.put) {
                        actions.push({ r : this.buildlink("put", params), n : this._states.put.label });
                    }
                    if (this._states.delete) {
                        actions.push({ r : this.buildlink("delete", params), n : this._states.delete.label });
                    }
                }
                */
               this.store.component = "ptj-repo";
               this.store.index = this._name + "-get";
               this.store.reload = () => { this.load(); };

               this.store.next = (key) => {
                    if (this._states.getprimary) {
                        this.buildIntention("getprimary", key);
                    } else if (this._states.put) {
                        this.buildIntention("put", key);
                    }
                    this.store.active_repo = [];
                }

                this.store.addKeys = data => {

                };

                if (!this.store.settings.fields) {
                    this.store.settings.fields = [];
                    for(let i in this.store.fields) {
                        if (i == this.primarykey || this.store.fields[i].summary) {
                            this.store.settings.fields.push(i);
                        }
                    }
                }


                this.store.submiturl = this.loadurl;
            },
            'getprimary': () => {
                this.store.actions = [];
                this.store.index = this._name + "-getprimary";
                if (this._states.put) {
                    this.store.actions.push({ r: this.buildlink("put"), n: this._states.getprimary.actions.put });
                }
                if (this._states.delete) {
                    this.store.actions.push({ r: async () => {
                        if (confirm("Are you sure you want to delete this record and all associated children?")) {
                            let data = {};
                            data[this._primary_key] = this._key_states.primary_key;
                            await client.delete("/" + this._name, data);
                            this.buildIntention("get", this._key_states.parent_key);
                        }
                    }, n: this._states.getprimary.actions.delete });
                }
                this.store.component = "ptj-single-item";

                if (!this.store.settings.fields) {
                    this.store.settings.fields = [];
                    for(let i in this.store.fields) {
                        this.store.settings.fields.push(i);
                    }
                }

                if (this._main_model) {
                    this.store.next = () => {
                        this._main_model.change_intention = {state : "getprimary", key : this.key, target : 0, model : this._name };
                    }
                }
            },
            'post': () => {
                this.store.component = (this._states.login) ? "ptj-account-handler" : "ptj-form";
                this.store.index = this._name + "-post";
                this.store.actions = [];
                if (this._states.login) {
                    this.store.actions.push({ r: this.buildlink("login"), n: this._states.post.actions.login });
                }

                this.store.next = () => {
                    this.buildIntention("get");
                };

                if (!this.store.settings.fields) {
                    this.store.settings.fields = [];
                    for(let i of this._states.post.fields) {
                        this.store.settings.fields.push(i);
                    }
                }


                this.store.addKeys = data => {
                    data[this._parent_key] = this._key_states.parent_key;
                };

                this.store.resolveKeys = data => {
                    this._key_states.primary_key = data[this._primary_key];
                }
            },
            'put': () => {
                this.store.component = "ptj-form";
                this.store.index = this._name + "-put";
                this.store.actions = [];
                this.store.next = () => {
                    if (this._states.getprimary) {
                        this.buildIntention("getprimary");
                    } else {
                        this.buildIntention("get");
                    }
                }


                if (!this.store.settings.fields) {
                    this.store.settings.fields = [];
                    for(let i of this._states.put.fields) {
                        this.store.settings.fields.push(i);
                    }
                }
               

                this.store.addKeys = data => {
                    data[this._primary_key] = this._key_states.primary_key;
                };
            },
            'login': () => {
                this.store.component = "ptj-account-handler";
                this.store.index = this._name + "-login";
                this.store.actions = [];
                if (this._states.post) {
                    this.store.actions.push({ r: this.buildlink("post"), n: this._states.login.actions.post });
                }

                if (!this.store.settings.fields) {
                    this.store.settings.fields = [];
                    for(let i of this._states.login.fields) {
                        this.store.settings.fields.push(i);
                    }
                }

                this.store.method = "post";
                this.store.submiturl += "-login";
                this.store.next = null;
            }
        }

        states[this._active_state]();

        for(let i in this.store.fields) {
            this.store.fields[i].on = false;
        }

        for(let field of this.store.settings.fields) {
            this.store.fields[field].on = true;
        }
    }
    
}