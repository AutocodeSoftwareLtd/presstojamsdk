import client from "./client.js"
import { reactive } from "vue"

import { MetaRow } from "./metarow.js"
import { DataTemplate } from "./datatemplate.js"
import { DataRow } from "./datarow.js"
import ChangeAction from "./changeaction.js"


export class Model {
    constructor(map, stage) {
        this._map = map;
        this._stage = stage;
        this._label = '';
        this._title = '';
        this._component = '';
        this._rawcomponent = '';
        this._actions = {};
        this._next = null;
        this._index = 0;
        this._primary_key_name = "";
        this._parent_key_name = "";
        this._circular = '';
        this._siblings = [];
        this._children = [];
        this._groups = [];
        this._classes= "";
        this._settings = { hide_actions : {}};
        this._meta_row = new MetaRow();
        this._global_meta_row = new MetaRow();
        this._data_template = null;
        this._data = null;
        this._global_data;
        this._store = reactive({});
        this._back;
    }

    
    get map() {
        return this._map;
    }

   
    get stage() {
        return this.store.stage;
    }


    injectCustomSettings(settings) {
        this._settings = settings;
        if (!this._settings.hide_actions) this._settings.hide_actions = {};
    }


    init() {
        let url = (!this._map.model) ? "/route-core-default" : "/route-" + this._map.model;
        let method = "get";
        if (this._map.state == "primary" || this._map.state == "parent" ) {
            url += "-" + this._map.state;
        } else if (this._map.state == "login") {
            url += "-" + login;
            method = "post";
        } else if (this._map.state == "put" || this._map.state == "post") {
            method = this._map.state;
        }
   
        let data = {};
        if (this._map.to) data.__to = this._map.to;
        return client[method](url, data)
        .then(response => {
            if (response.__status != "SUCCESS") {
                throw new Error(response);
            }
            return response;
        })
        .then(response => {   

            this._map.state = response.state;
            this._map.model = response.model;

            this._label = response.label;
            this._title = response.title;
        
            this._back = response.back;

            for(let i in response.children) {
                this._children.push({ name : i, label : response.children[i]});
            }

            for(let i in response.siblings) {
                this._siblings.push({ name : i, label : response.siblings[i]});
            }
      
            for(let i in response.fields) {
                if (response.fields[i].circular) this._circular = i;
            }

            this._actions = response.actions;
            this.buildMetaRow(response);
        })
        .catch(e => console.log(e));
    }



    get fields() {
        return this._fields;
    }

    get classes() {
        return this._name.replace("_", "-") + " " + this._map.state;
    }

   
    snakeCase(name) {
        return name.replace("-", "_");
    }


    buildMetaRow(response) {
        this._meta_row = new MetaRow();

        this._meta_row.map(response.fields);
        
        let global_fields = {};
        for(let field in response.fields) {
            if (response.fields[field].is_primary) global_fields[field] = response.fields[field];
            else if (response.fields[field].is_parent) global_fields[field] = response.fields[field];
        }

        this._global_meta_row.map(global_fields);
    }


    loadURL(state) {
        let url = "/" + this._map.model;
        if (state == "primary" ||  state == "put") url += "-primary";
        else if (state == "parent") url += "-parent";
        return url;
    }

    saveURL() {
        let url = "/" + this._map.model;
        return url;
    }

    initDataTemplate() {
        this._data_template = new DataTemplate(this._meta_row);

        if (this._map.state == "get") {
            if (this._map.key == "first") this._data_template.limit = 1;
            else if (this._map.key) this._data_template.parent.setVal(this._map.key);
        } else if (this._map.state == "parent") {
            if (this._map.key == "first") this._data_template.limit = 1;
            else if (this._map.key) this._data_template.parent.setVal(this._map.key);
        } else if (this._map.state == "post") {
            this._global_data = new DataRow(this._global_meta_row);
            if (this._map.key) {
                this._data_template.parent.setVal(this._map.key);
                this._global_data.parent.setVal(this._map.key);
            }
        } else if (this._map.state != "login") {
            this._data_template.primary.setVal(this._map.key);
        }
    
        if (this._map.param_str) {
            this._data_template.convertFromParams(this._map.param_str);
        }
    
        if (this._settings.groups) {
            this._data_template.groups = this._settings.groups;
        }

        if (this._settings.limit) {
            this._data_template.limit = this._settings.limit;
        }
    
   
    }


    load() {
        this.initDataTemplate();
        if (this._map.state == "get" || this._map.state == "parent") {
            let params = this._data_template.convertToAPIParams(this._map.state);
            if (this._map.to) {
                if (!params) params = {};
                params.__to = this._map.to;
            }

            if (this._settings.fields) {
                if (!params) params = {};
                params.__fields = this._settings.fields;
            }

            if (this._data_template.limit > 0) {
                return client.get(this.loadURL(this._map.state) + "-count", params)
                .then(response => {
                    this._data_template.count = response.count;
                    this._data_template.max_pages = Math.ceil(response.count / this._data_template.limit);
                })
                .then(() => {
                    return client.get(this.loadURL(this._map.state), params);
                })
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
            } else {
                return client.get(this.loadURL(this._map.state), params)
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data_template.count = response.__data.length;
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
           
            }

        } else if (this._map.state == "primary" || this._map.state == "put") {
            let params = this._data_template.convertToAPIParams(this._map.state);
            if(this._map.to) params.__to = this._map.to;
            return client.get(this.loadURL(this._map.state), params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = {};
                    this.mapData(response);
                    return response;
            })
            .then(response => {
                this._global_data = new DataRow(this._global_meta_row);
                this._global_data.row = response;
                if (this._map.state == "put") {
                    return this.setReferences();
                }
            });
        } else if (this._map.state == "post") {
            this._data = new DataRow(this._meta_row);
            if (this._data_template.parent) this._data.parent.setVal(this._data_template.parent.toVal());
            return this.setReferences();
        } else {
            this._data = new DataRow(this._meta_row);
            
            return Promise.resolve();
        }
    }


    reload() {
        this._data_template.page = 0;
        let params = this._data_template.convertToAPIParams("get");
        if (this._map.to) params.__to = this._map.to;
        return client.get(this.loadURL("get") + "-count", params)
        .then(response => {
            this._data_template.count = response.count;
            this._data_template.max_pages = Math.ceil(response.count / this._data_template.limit);
        })
        .then(() => {
            return client.get(this.loadURL("get"), params)
        }).then(response => {
            if (response.__status != "SUCCESS") throw new Error(response);
            this._data = [];
            this.mapRepoData(response);
            return response;
        })
        .then(() => {
            this._store.data = this._data;
            this._store.data_template = this._data_template.count;
        });
    }


    rLoadObj(data) {
        let obj= new DataRow(this._meta_row);
        obj.row = data;

        if (this._circular) {
            if (data[this._map.model]) {
                for(const i in data[this._map.model]) {
                    obj.addChild(this._map.model, this.rLoadObj(data[this._map.model][i]));
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


    import(file) {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result )
            };
            fr.onerror = reject;
            fr.readAsText(file.blob);
        })
        .then(data => {
            const headers = {};
            for(let i in data[0]) {
                headers[data[0][i]] = i;
            }

            for(let i = 1; i<data.length; ++i) {
                //run row based on the headers
            }
        });
    }

    submit() {
        let key = 0;
        let data = this._data.serialize(this._map.state);
        return client[this._map.state](this.saveURL(), data)
        .then(request=>{
            if (request.__status!= "SUCCESS") {
                throw { message : request.statusText }
            }
            if (this._map.state == "post") {
                key = request.__key;
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
                asset.keyfield = this._store.data.primary.name;
                let promise = asset.saveFile(assets[i].toVal(), this._store.data.primary.toVal())
                .then(() => {
                    ++this._store.progress.progress;
                });
                promises.push(promise);
            }
            return Promise.all(promises);
        })
        .then(() => {
            return key;
        });
    }


    setReferences() {
        let promises = [];

        const cells = this._meta_row.getCellByType("id");
        for(let name in cells) {
            if (cells[name].reference || cells[name].circular) {
                let params = {};
                if (this._global_meta_row.parent) params[this._global_meta_row.parent.name] = this._global_data.parent.toVal();
                promises.push(cells[name].setReferenceOptions("/" + this._map.model + "-" + name.replace("_", "-") + "-reference", params));
            } 
        }
        return Promise.all(promises);
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
            for(let setting in this._settings.change_intention) {
                intention[setting] = this._settings.change_intention[setting];
            }
            ChangeAction.updateIntention(this._stage, intention);
            return Promise.resolve();
        }
    }

    
    exportToStore() {
        this._store.actions = [];
        this._store.stage = this._stage;
        this._store.component = "";
        this._store.rawcomponent = "";
        this._store.title = this._title;
        this._store.label = this._label;
        this._store.action = this._map.state;
        this._store.method = this._store.action;
        this._store.submiturl = this.saveurl;
        this._store.model = this._map.model;
        this._store.classes = this._map.model + " " + this._map.state;
        this._store.groups = this._data_template.groups;
        if (!this._store.settings) this._store.settings = {};

        if (this._settings.disable_filter) {
            this._store.disable_filter = true;
        }

        if (this._settings.disable_selectfields) {
            this._store.disable_selectfields = true;
        }
    
        if (this._map.state == "get" || this._map.state == "parent") {
            this._store.rawcomponent = (this._data_template.groups.length > 0) ? "ptj-list" : (this._circular || this._data_template.children.length > 0) ? "ptj-tree" : "ptj-table";
            this._store.component = "ptj-repo";
            this._store.index = this._map.model + "-get";
            this._store.submiturl = this.loadurl;
            this._store.count = this._data_template.count;
            this._store.reload = () => { 
                this.buildLink({ param_str : this._data_template.convertToParams()})()
                .then(() => {
                    this.reload();
                });
            };

            if (this._back && !this._settings.hide_actions.parent) {
                this._store.actions.push({
                    r : this.buildLink({ model : this._back.model, "state" : "primary", key : this._data_template.parent.toVal() }),
                    n: "go back"
                });
            }

            if (this._actions.post && !this._settings.hide_actions.post) {
                this._store.actions.push({ r: this.buildLink({ "state" : "post"}), n: this._actions.post });
            }


            if (this._actions.primary) {
                this._store.next = this.buildLink({ param_str : "", state : "primary"});
            } else if (this._actions.put) {
                this._store.next = this.buildLink({ param_str : "", state : "put"});
            }

            this._store.siblings = [];
            if (!this._settings.hide_actions.children) {
                for (let sibling of this._siblings) {
                    this._store.siblings.push({
                        r: this.buildLink({ model: sibling.name, param_str: "" }),
                        n: sibling.label
                    });
                }
            }

            if (this._data_template.limit > 0) {
                this._store.setPage = (page) => {
                    this._store.data_template.page = page;
                    this.buildLink({ param_str : this._data_template.convertToParams()})()
                    .then(() => { this.reload(); });
                }
            }
        } else if (this._map.state == "primary") {
            this._store.component = "ptj-single-item";
            this._store.actions = [];
            this._store.index = this._map.model + "-primary";

            if (this._back && !this._settings.hide_actions.parent) {
               /* this._store.actions.push({
                    r : this.buildLink({ key : this._data_template.parent.toVal(), state : this._back.state}),
                    n: this._actions.get 
                });*/
            }

            if (this._actions.put && !this._settings.hide_actions.put) {
                this._store.actions.push({ 
                    r: this.buildLink({ state : "put"}), 
                    n: this._actions.put 
                });
            }
            if (this._actions.delete && !this._settings.hide_actions.delete) {
                this._store.actions.push({
                    r: () => {
                        if (confirm("Are you sure you want to delete this record and all associated children?")) {
                            let data = {};
                            data[this._meta_row.primary.name] = this._data.primary.toVal();
                            return client.delete(this.saveURL(), data)
                            .then(() => {
                                let map = { "state" : "get"};
                                if (this._global_data.parent) map.key = this._global_data.parent.toVal();
                                return this.buildLink(map)();
                            })
                        } 
                        return Promise.reject("Delete cancelled");
                    }, n: this._actions.delete
                });
            }

            this._store.children = [];
            if (!this._settings.hide_actions.children) {
                for (let child of this._children) {
                    this._store.children.push({
                        r: this.buildLink({ state: "parent", model: child.name }),
                        n: child.label
                    });
                }
            }
        } else if (this._map.state == "post") {
            this._store.component = (this._actions.login) ? "ptj-account-handler" : "ptj-form";
            this._store.index = this._map.model + "-post";
            this._store.progress = {total : 0, progress : 0};
            this._store.actions = [];
            if (this._actions.login) {
                this._store.actions.push({r : this.buildLink({ state : "login"}), n: this._actions.login });
            }

            this._store.next = key => {
                let state = "";
                if (this._actions.parent) state = "parent";
                else if (this._actions.get) state = "get";
                else if (this._actions.primary) state = "primary";
                return this.buildLink({ 
                    state : state, 
                    active : key
                })();
            }

                
            this._store.submit = () => {
                return this.submit("post");
            }
        } else if (this._map.state == "put") {
            this._store.component = "ptj-form";
            this._store.progress = {total : 0, progress : 0};
            this._store.index = this._map.model + "-put";
            this._store.actions = [];
            if (this._actions.primary) this._store.next = this.buildLink({ state : "primary"});
            else {
                let map = { "state" : "get"};
                if (this._global_data.parent) map.key = this._global_data.parent.toVal();
                this._store.next = this.buildLink(map);
            }
            this._store.submit = () => {
                return this.submit("put");
            }
        } else if (this._map.state == "login") {
            this._store.component = "ptj-account-handler";
            this._store.index = this._map.model + "-login";
            this._store.progress = {total : 0, progress : 0};
            this._store.submit = () => {
                let data = this._data.serialize("login");
                return client.post(this.saveURL() + "-login", data)
                .then(request=>{
                    if (request.__status!= "SUCCESS") {
                        throw { message : request.statusText }
                    }
                    return request;
                });
            } 
            this._store.actions = [];
            if (this._actions.post) {
                this._store.actions.push({ r: this.buildLink({ state : "post"}), n: this._actions.post });
            }
        }

        this._store.data = this._data;
        this._store.indexes = this._indexes;
        this._store.data_template = this._data_template;
        this._meta_row.exportToStore(this._store);
        return this._store;
    }

}
