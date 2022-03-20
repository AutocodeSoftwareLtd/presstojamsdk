import client from "./client.js"
import { Field } from "./field.js"
import { reactive } from "vue"
import { Asset } from "./asset.js"


export class Model {
    constructor() {
        this._name;
        this._states = {};
        this._default_state;
     
        this._primary_key;
        this._parent_key;
        this._circular;
        this._children = [];
        this._active_children = [];
        this._key_states = { parent_key : null, primary_key : null };
        this._settings = {};
        this._active_state;
        this._change_intention;
    
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
            groups : []
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
        this.loadState();
    }

    set groups(groups) {
        this.store.groups = groups;
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

    injectCustomSettings(settings) {
        for(let i in settings) {
            if (this[i]) this[i] = settings[i];
            else if (this.store[i]) this.store[i] = settings[i];
        }
        this._settings = settings;
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
        if (this._to) params.__to = this._to;
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
            to : this._to,
            stage : this._stage
        }
    }

    buildIntention(state, key = null) {
        if (!key) key = this._key;
        this._change_intention = {state : state, key : key, intent : 0};
        if (this._settings.intentions && this._settings.intentions.state) {
            for(let i in this._settings.intentions.state) {
                this._change_intention[i] = this._settings.intentions.state[i];
            }
        }
        //now set any extra values

    }

    init() {
        this._init = true;
        let url = "/route-" + this._name;
        let data = {};
        if (this._to) data.__to = this._to;
        return client.get(url, data)
        .then(response => {
            if (response.__status != "SUCCESS") {
                throw new Error(response);
            }

            this.mapResponse(response);
           
            //build parent states
            this._parent_models = [];
            let par = response.to;
            while(par) {
                let pmodel = new Model();
                pmodel.mapResponse(par);
                pmodel.state = "getprimary";
                this.store.parent_models.push(pmodel);
                par = par.to;
            }
            this._parent_models = this._parent_models.reverse();
            return response;
        });
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
                this._change_intention.to = this._name;
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

        this._parent_models = [];
        let par = response.to;
        while(par) {
            let pmodel = new Model({ model : par.model, key : 0 });
            pmodel.mapResponse(par);
            pmodel.state = "getprimary";
            this.store.parent_models.push(pmodel);
            par = par.to;
        }
        this._parent_models = this._parent_models.reverse();
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
            })
            .then(() => {
                if (this.store.parent_models.length > 0) {
                    let parent = this.store.parent_models[0];
                    parent.key = this.key;
                    parent.to = this._to;
                    return client.get(parent.loadurl, parent.params)
                    .then(response => {
                        if (response.__status != "SUCCESS") throw new Error(response);
                        let parent = this.store.parent_models[this.store.parent_models.length - 1];
                        parent.mapData(response);
                        for(let i =0, n=this.store.parent_models.length - 1; i<n; ++i) {
                            let parent = this.store.parent_models[i];
                            parent.mapData(response[parent.name]);
                        }
                    });
                }
            });

        } else if (this._active_state == "getprimary" || this._active_state == "put") {
            return client.get(this.loadurl, this.params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                
                    this.mapData(response);

                    for(let parent in this.store.parent_models) {
                        if (response[parent.name]) {
                                //need to set the field data for this
                            parent.mapData(response[parent.name]);
                        }
                    }
            });
        } else if (this._active_state == "post" && this.store.parent_models.length > 0) {
            let parent = this.store.parent_models[0];
            parent.keymanager = this._key_states.parent_key;
            parent.to = this._to;
            return client.get(parent.loadurl, parent.params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                let parent = this.store.parent_models[this.store.parent_models.length - 1];
                parent.mapData(response);
                for(let i =0, n=this.store.parent_models.length - 1; i<n; ++i) {
                    let parent = this.store.parent_models[i];
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
            obj[field] =  data[field];
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

    rGroupData(data, group) {
        let groups = {};
        for(const key in data) {
            const row = data[key];
            if (Array.isArray(row)) groups[key] = this.rGroupData(row, group);
            else {
                if (!groups[row[group]]) groups[row[group]] = [];
                groups[row[group]].push(row);
            }
        }
        return groups;
    }

    mapRepoData(response) {
        this.store.data = [];
        for (const i in response.__data) {
            const data = this.rLoadObj(response.__data[i]);
            this.store.data.push(data);
        }

        
        //now we need to group the data by
        for(const group of this.store.groups) {
            this.store.data = this.rGroupData(this.store.data, group);
        }
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
        this.store.primarykey = () => {
            return this._key_states.primary_key;
        }

        this.store.addKeys = () => {};
        this.store.resolveKeys = () => {};

        for(let i in this.store.fields) {
            this.store.fields[i].on = false;
        }
    
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

                for(let i in this.store.fields) {
                    if (i == this.primarykey || this.store.fields[i].summary) {
                        this.store.fields[i].on = true;
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
                for(let i in this.store.fields) {
                    this.store.fields[i].on = true;
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

                for(let name of this._states.post.fields) {
                    this.store.fields[name].on = true;
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
                for(let name of this._states.put.fields) {
                    this.store.fields[name].on = true;
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
                for(let name of this._states.login.fields) {
                    this.store.fields[name].on = true;
                }
                this.store.method = "post";
                this.store.submiturl += "-login";
                this.store.next = null;
            }
        }

        states[this._active_state]();
    }
    
}