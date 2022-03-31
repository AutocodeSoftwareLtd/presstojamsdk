import { DataRow } from "./datarow.js"
import { DataTemplate } from "./datatemplate.js"
import { MetaRow } from "./metarow.js"
import ChangeAction from "./changeaction.js"
import client from "./client.js"
import { Field } from "./field.js"
import { reactive } from "vue"
import { Asset } from "./asset.js"

export class ModelInstance {
    constructor(stage) {
        this._label = '';
        this._title = '';
        this._component = '';
        this._rawcomponent = '';
        this._actions = [];
        this._next = null;
        this._index = 0;
        this._primary_key_name = "";
        this._parent_key_name = "";
        this._circular = '';
        this._model= "";
        this._siblings = [];
        this._children = [];
        this._groups = [];
        this._classes= "";
        this._states = {};
        this._default_state = "";
        this._settings = {};
        this._limit_fields = [];
        this._meta_row = new MetaRow();
        this._data_template = null;
        this._data = null;
        this._indexes = null;
        this._stage = stage;
        this._states;
        this._primary_field;
        this._to;
        this._store = reactive({});
    }

    get currentstate() {
        return (this._active_state) ? this._active_state : this._default_state;
    }


    get fields() {
        return this._fields;
    }

    get default_state() {
        return this._default_state;
    }

    get classes() {
        return this._name.replace("_", "-") + " " + this._state;
    }

    set to(to) {
        this._to = to;
    }

    applySettings(settings) {
        this._settings = settings;
    }


    
    snakeCase(name) {
        return name.replace("-", "_");
    }


    buildMetaRow(response, state) {
        this._meta_row = new MetaRow();

        let cfields = response.states[state].fields;
        if (!cfields) {
            cfields = response.fields;
        } else {
            let use_fields = {};
            for(let field of cfields) {
                use_fields[field] = response.fields[field];
            }
            cfields = use_fields;
        }
        this._meta_row.map(cfields);

        for(let field in response.fields) {
            if (response.fields[field].is_primary) this._primary_field = new Field(response.fields[field]);
        }

        let par = response.to;
        while(par) {
            let p_meta = new MetaRow();
            p_meta.map(par.fields);
            this._meta_row.addReference(par.model, p_meta);
            par = par.to;
        }
    }


    initState(response, state) {
        if (!state) state = response.default_state;
        this._model = response.model;
        this._primary_key_name = response.primarykey;
        this._parent_key_name = response.parentkey;
        this._children = response.children;
        this._siblings = response.siblings;
        this._circular = response.circular;
        this._states = response.states;
        this._default_state = response.default_state;
        this.buildMetaRow(response, state);
        this._children = response.children;
        this._siblings = response.siblings;
        this._states = response.states;
    }


    loadURL(state) {
        let url = "/" + this._model;
        if (state == "getprimary" ||  state == "put") url += "-primary";
        return url;
    }

    saveURL() {
        let url = "/" + this._model;
        return url;
    }

    initDataTemplate(map) {
        this._to = map.to;
        this._data_template = new DataTemplate(this._meta_row);

        if (map.state == "get" || map.state == "post") {
            if (map.key) this._data_template.parent.setVal(map.key);
        } else if (map.state != "login") {
            this._data_template.primary.setVal(map.key);
        }
    
        if (map.param_str) {
            this._data_template.convertFromParams(map.param_str);
        }
    
        if (this._settings.groups) {
            this._data_template.groups = this._settings.groups;
        }

        if (this._settings.limit) {
            this._data_template.limit = this._settings.limit;
        }
    
    
        if (map.state == "post" || map.state == "put") {
            for(let name in this._meta_row.fields) {
                if (this._meta_row.fields[name].type == "select") {
                    let params = {};
                    params[this._meta_primary_key_name] = this._key;
                    this._meta_row.fields[name].setOptions(params);
                }
            }
        }
        
    }


    load(state) {
        if (state == "get") {
            let params = this._data_template.convertToAPIParams(state);
            if (this._to) params.__to = this._to;

            if (this._data_template.limit > 0) {
                return client.get(this.loadURL("get") + "-count", params)
                .then(response => {
                    this._data_template.max_pages = Math.ceil(response.count / this._data_template.limit);
                })
                .then(() => {
                    return client.get(this.loadURL("get"), params);
                })
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
            } else {
                return client.get(this.loadURL("get"), params)
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
           
            }

        } else if (state == "getprimary" ||state == "put") {
            let params = this._data_template.convertToAPIParams(state);
            if(this._to) params.__to = this._to;
            return client.get(this.loadURL(state), params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = {};
                    this.mapData(response);
            });
        } else if (state == "post") {
            this._data = new DataRow(this._meta_row);
            if (this._data_template.parent) this._data.parent.setVal(this._data_template.parent.toVal());
        } else {
            this._data = new DataRow(this._meta_row);
            
            return Promise.resolve();
        }
    }


    reload() {
        let params = this._data_template.convertToAPIParams("get");
        if (this._to) params.__to = this._to;
        return client.get(this.loadURL("get"), params)
        .then(response => {
            if (response.__status != "SUCCESS") throw new Error(response);
            this._data = [];
            this.mapRepoData(response);
            return response;
        })
        .then(() => this._store.data = this._data);
    }


    rLoadObj(data) {
        let obj= new DataRow(this._meta_row);
        obj.row = data;

        if (this._circular && data[this._model]) {
            if (data[this._model]) {
                for(const i in data[this._model]) {
                    obj.addChild(this._model, this.rLoadObj(data[this._model][i]));
                }
            }
        }

        for(const i in this._active_children) {
            const name = this._active_children[i];
            if (data[name]) {
                for(const x in data[name]) {
                    obj.addChild(name, this.rLoadObj(data[name][x]));
                }
            }
        }
        return obj;
    }

    indexData(data) {
        let indexes = {};
        for(const key in data) {
            const row = data[key];
            for(let group of this._data_template.groups) {
                group = this.snakeCase(group);
                if (!indexes[group]) indexes[group] = {};
                let ckey = row.getCell(group).toVal();
                if (!indexes[group][ckey]) {
                    indexes[group][ckey] = {"display": "", "contains":[]};
                    indexes[group][ckey].display= row.getCell(group).display;
                }
                indexes[group][ckey].contains.push(key);
            }
        }
        return indexes;
    }


    submit(state) {
        let data = this._data.serialize(state);
        return client[state](this.saveURL(), data)
        .then(request=>{
            if (request.__status!= "SUCCESS") {
                throw { message : request.statusText }
            }
            if (state == "post") {
                this._store.data.primary.setVal(request[this._store.data.primary.meta.name]);
            }
        })
        .then(() => {
            let promises = [];
            let assets = this._store.data.getCellByType("asset");
            this._store.progress.total = 0;
            for(let i in assets) {
                const val = assets[i].toVal();
                if (!val) continue;
                ++this._store.progress.total;
                const asset = new Asset();
                asset.url = this.saveURL() + "-" + i;
                let promise = asset.saveFile(assets[i].toVal(), this._store.data.primary.toVal())
                .then(() => {
                    ++this._store.progress.progress;
                });
                promises.push(promise);
            }
            return Promise.all(promises);
        });
    }

    mapRepoData(response) {
        this._data = [];
        for (const i in response.__data) {
            const data = this.rLoadObj(response.__data[i]);
            this._data.push(data);
        }

        
        //now we need to group the data by
        if (this._data_template.groups.length > 0) this._indexes = this.indexData(this._data);
    }

    mapData(data) {
        this._data = new DataRow(this._meta_row);
        this._data.row = data;
    }


    buildLink = (intention) => {
        return key => {
            if (key) intention.key = key;
            for(let setting in this._change_settings) {
                intention[setting] = this._change_settings[setting];
            }
            ChangeAction.updateIntention(this._stage, intention);
        }
    }

    
    exportToStore(state) {
        this._store.actions = [];
        this._store.stage = this._stage;
        this._store.component = "";
        this._store.rawcomponent = "";
        this._store.title = this._states[state].title;
        this._store.label = this._states[state].label;
        this._store.action = state;
        this._store.method = this._store.action;
        this._store.submiturl = this.saveurl;
        this._store.model = this._model;
        this._store.classes = this._model + " " + state;
        this._store.groups = this._data_template.groups;
        if (!this._store.settings) this._store.settings = {};

        if (this._settings.disable_filter) {
            this._store.disable_filter = true;
        }

        if (this._settings.disable_selectfields) {
            this._store.disable_selectfields = true;
        }
       
        let states = {
            'get': () => {
                this._store.rawcomponent = (this._data_template.groups.length > 0) ? "ptj-list" : (this._circular || this._data_template.children.length > 0) ? "ptj-tree" : "ptj-table";
                this._store.component = "ptj-repo";
                this._store.index = this._model + "-get";
                this._store.submiturl = this.loadurl;
                this._store.reload = () => { 
                    this.buildLink({ param_str : this._data_template.convertToParams()})();
                    this.reload();
                };

                if (this._meta_row.parent) {
                    this._store.actions.push({
                        r : this.buildLink({ model : this._meta_row.parent.reference, "state" : "getprimary" }),
                        n: "go back"
                    });
                }

                if (this._states.post) {
                    this._store.actions.push({ r: this.buildLink({ "state" : "post"}), n: this._states.get.actions.post });
                }


                if (this._states.getprimary) {
                    this._store.next = this.buildLink({ param_str : "", state : "getprimary"});
                } else if (this._states.put) {
                    this._store.next = this.buildLink({ param_str : "", state : "put"});
                }

                this._store.siblings = [];
                for (let sibling of this._siblings) {
                    this._store.siblings.push({
                        r: this.buildLink({ model : sibling.name, param_str : ""}), 
                        n: sibling.label
                    });
                }

                if (this._data_template.limit > 0) {
                    this._store.setPage = (page) => {
                        this._store.data_template.page = page;
                        this.buildLink({ param_str : this._data_template.convertToParams()})();
                        this.reload();
                    }
                }
            },
            'getprimary': () => {
                this._store.component = "ptj-single-item";
                this._store.actions = [];
                this._store.index = this._model + "-getprimary";

                if (this._meta_row.parent) {
                    this._store.actions.push({
                        r : this.buildLink({ key : this._data.parent.toVal(), state : "get"}),
                        n: this._states.getprimary.actions.get 
                    });
                }

                if (this._states.put) {
                    this._store.actions.push({ 
                        r: this.buildLink({ state : "put"}), 
                        n: this._states.getprimary.actions.put 
                    });
                }
                if (this._states.delete) {
                    this._store.actions.push({
                        r: async () => {
                            if (confirm("Are you sure you want to delete this record and all associated children?")) {
                                let data = {};
                                data[this._meta_row.primary.name] = this._data.primary.toVal();
                                await client.delete(this.saveURL(), data);
                                this.buildLink({ state : "get", key : this._data.parent.toVal()})();
                            }
                        }, n: this._states.getprimary.actions.delete
                    });
                }

                

                this._store.children = [];
                for (let child of this._children) {
                    this._store.children.push({
                        r: this.buildLink({ state : "get", model : child.name }), 
                        n: child.label
                    });
                }
            },
            'post': () => {
                this._store.component = (this._states.login) ? "ptj-account-handler" : "ptj-form";
                this._store.index = this._model + "-post";
                this._store.progress = {total : 0, progress : 0};
                this._store.actions = [];
                if (this._states.login) {
                    this._store.actions.push({r : this.buildLink({ state : "login"}), n: this._states.post.actions.login });
                }

                this._store.next = response => {
                    this.buildLink({ state : "getprimary", key : response[this._primary_key_name]})();
                }

                this._store.createPrimaryKey = response => {
                    this._store.data.appendPrimary(this._primary_field);
                    this._store.data.primary.setVal(response[this._primary_field.name]);
                }

                this._store.submit = () => {
                    return this.submit("post");
                }
            },
            'put': () => {
                this._store.component = "ptj-form";
                this._store.progress = {total : 0, progress : 0};
                this._store.index = this._model + "-put";
                this._store.actions = [];
                if (this._states.getprimary) this._store.next = this.buildLink({ state : "getprimary"});
                else this._store.next = this.buildLink({ state : "get", key : this._keys.parent_key});
            
                this._store.submit = () => {
                    return this.submit("put");
                }
            },
            'login': () => {
                this._store.component = "ptj-account-handler";
                this._store.index = this._model + "-login";
                this._store.method = "post";
                this._store.submiturl += "-login";
                this._store.actions = [];
                if (this._states.post) {
                    this._store.actions.push({ r: this.buildLink({ state : "post"}), n: this._states.login.actions.post });
                }
                this._store.next = null;
            }
        }

        states[state]();

        this._store.data = this._data;
        this._store.indexes = this._indexes;
        this._store.data_template = this._data_template;
        this._meta_row.exportToStore(this._store);
        return this._store;
    }

}
