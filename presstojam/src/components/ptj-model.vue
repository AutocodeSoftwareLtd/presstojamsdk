<template>
    <div :class="[map.model, map.state]">
        <h1>{{ title }}</h1>
        <component v-if="component" :is="component" :metarow="meta_row" :actions="actions" />
    </div>
</template>

<script setup>


import client from "./../js/client.js"
import { MetaRow } from "./../js/metarow.js"
import ChangeAction from "./../js/changeaction.js"
import Settings from "./../js/settings.js"
import ModuleLoader from "./../js/moduleloader.js"
import { ref, computed, defineAsyncComponent } from "vue"

const props = defineProps({
    "map" : Object,
});

const settings = Settings.getModelSettings(props.map.model, props.map.state);
let title = ref('');
let component_name = ref('');
let component = computed(() => {
    if (component_name.value) {
        return defineAsyncComponent(() => ModuleLoader.loadModule(component_name.value));
    } else {
        return null;
    }
});
let actions = {};
let recursive = '';
let children = [];


const meta_row = new MetaRow();


function loadURL(map, state) {
    let url = "/" + map.model;
    if (state == "primary" ||  state == "put") url += "-primary";
    else if (state == "parent") url += "-parent";
    return url;
}

function saveURL(map) {
    let url = "/" + map.model;
    return url;
}

function initDataTemplate() {
     data_template = new DataTemplate(meta_row);

    if (props.map.state == "get") {
        if (props.map.key == "first") data_template.limit = 1;
        else if (props.map.key) data_template.parent.setVal(props.map.key);
    } else if (props.map.state == "parent") {
        if (props.map.key == "first") data_template.limit = 1;
        else if (props.map.key) data_template.parent.setVal(props.map.key);
    } else if (props.map.state == "post") {
        
     } else if (props.map.state != "login") {
            data_template.primary.setVal(props.map.key);
    }
    
    if (props.map.param_str) {
        data_template.convertFromParams(props.map.param_str);
    }
    
    if (props.settings.groups) {
        data_template.groups = props.settings.groups;
    }

    if (props.settings.limit) {
        data_template.limit = props.settings.limit;
    }
    
}


function load() {
        this.initDataTemplate();
        if (props.map.state == "get" || props.map.state == "parent") {
            let params = this._data_template.convertToAPIParams(props.map.state);
            if (!params) params = {};
            if (props.map.to) {
                params.__to = props.map.to;
            }
   
            this.applySettingsToParams(params);

            if (this._data_template.limit > 0) {
                return client.get(this.loadURL(props.map.state) + "-count", params)
                .then(response => {
                    this._data_template.count = response.count;
                    this._data_template.max_pages = Math.ceil(response.count / this._data_template.limit);
                })
                .then(() => {
                    return client.get(this.loadURL(props.map.state), params);
                })
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
            } else {
                return client.get(this.loadURL(props.map.state), params)
                .then(response => {
                    if (response.__status != "SUCCESS") throw new Error(response);
                    this._data_template.count = response.__data.length;
                    this._data = [];
                    this.mapRepoData(response);
                    return response;
                });
           
            }

        } else if (props.map.state == "primary" || props.map.state == "put") {
            let params = this._data_template.convertToAPIParams(props.map.state);
            if (!params) params = {};
            if (this._settings && this._settings.to) params.__to = this._settings.to;
            else if(props.map.to) params.__to = props.map.to;
            return client.get(this.loadURL(props.map.state), params)
            .then(response => {
                if (response.__status != "SUCCESS") throw new Error(response);
                    data.row = response;
                    return response;
            })
            .then(response => {
                this._global_data = new DataRow(this._global_meta_row);
                this._global_data.row = response;
                if (props.map.state == "put") {
                    return this.setReferences();
                }
            });
        } else if (props.map.state == "post") {
            this._data = new DataRow(this._meta_row);
            if (this._data_template.parent) this._data.parent.setVal(this._data_template.parent.toVal());
            return this.setReferences();
        } else {
            this._data = new DataRow(this._meta_row);
            
            return Promise.resolve();
        }
    }



function rLoadObj(data) {
        let obj= new DataRow(this._meta_row);
        obj.row = data;

        if (this._circular) {
            if (data[props.map.model]) {
                for(const i in data[props.map.model]) {
                    obj.addChild(props.map.model, this.rLoadObj(data[props.map.model][i]));
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

function indexData(data) {
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


function importCSV(file) {
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




function setReferences() {
        let promises = [];

        const cells = this._meta_row.getCellByType("id");
        for(let name in cells) {
            if (cells[name].reference || cells[name].circular) {
                let params = {};
                if (this._global_meta_row.parent) params[this._global_meta_row.parent.name] = this._global_data.parent.toVal();
                promises.push(cells[name].setReferenceOptions("/" + props.map.model + "-" + name.replace("_", "-") + "-reference", params));
            } 
        }
        return Promise.all(promises);
    }

function mapRepoData(response) {
        this._data = [];
        for (const i in response.__data) {
            const data = this.rLoadObj(response.__data[i]);
            this._data.push(data);
        }

        
        //now we need to group the data by
        if (this._data_template.groups.length > 0) this._indexes = this.indexData(this._data);
    }

  

let buildLink = (intention) => {
        return key => {
            if (key) intention.key = key;
            for(let setting in this._settings.change_intention) {
                intention[setting] = this._settings.change_intention[setting];
            }
            ChangeAction.updateIntention(this._stage, intention);
            return Promise.resolve();
        }
    }



const init = async() => {
    let url = (!props.map.model) ? "/route-core-default" : "/route-" + props.map.model;
    let method = "get";
    if (props.map.state == "primary" || props.map.state == "parent" ) {
        url += "-" + props.map.state;
    } else if (props.map.state == "login") {
        url += "-" + login;
        method = "post";
    } else if (props.map.state == "put" || props.map.state == "post") {
        method = props.map.state;
    }
   
    let data = {};
    if (props.map.to) data.__to = props.map.to;
    if (settings.fields) data.__fields = settings.fields;

    console.log(url, data);
        
    client[method](url, data)
    .then(response => {
        if (response.__status != "SUCCESS") {
            throw new Error(response);
        }
        return response;
    })
    .then(response => {   

        let data = {};

        title.value = response.title;
        
        data.back = response.back;

        for(let i in response.children) {
             children.push({ name : i, label : response.children[i]});
        }

   
        for(let i in response.fields) {
            if (response.fields[i].circular) recursive = i;
        }

        actions = response.actions;


        meta_row.map(response.fields);
        console.log(meta_row);


         if (response.state == "get" || response.state == "parent") {
            component.value = (data_template.groups.length > 0) ? "ptj-list" : (this._circular || this._data_template.children.length > 0) ? "ptj-tree" : "ptj-table";
          
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
        } else if (response.state == "primary") {
            component.value = "ptj-single-item";
            this._store.actions = [];
        
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

            if (!this._settings.hide_actions.children) {
                for (let child of this._children) {
                    this._store.children.push({
                        r: this.buildLink({ state: "parent", model: child.name }),
                        n: child.label
                    });
                }
            }
        } else if (response.state == "post") {
            component.value = (this._actions.login) ? "ptj-account-handler" : "ptj-form";
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

        } else if (response.state == "put") {
            component_name.value = "ptj-form";
            this._store.progress = {total : 0, progress : 0};

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
        } else if (response.state == "login") {
            component_name.value = "ptj-account-handler";
           /* if (this._actions.post) {
                this._store.actions.push({ r: this.buildLink({ state : "post"}), n: this._actions.post });
            }*/
        }


//not sure about this
    })
    .catch(e => console.log(e));
}

init();

</script>