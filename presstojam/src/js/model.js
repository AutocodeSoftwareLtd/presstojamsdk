import client from "./client.js"

import { reactive } from "vue"
import { ModelInstance } from "./modelinstance.js";


export class Model {
    constructor(stage) {
        this._settings = {};
        this._map;
        this._previous_map;
        this._response;
        this._instance;
        this._stage = stage;
        this.store = reactive({
            stage : stage
        });
    }

    
    get map() {
        return this._map;
    }

    set map(map) {
        this._previous_map = { ...this._map };
        if (Object.keys(this._previous_map).length == 0) this._previous_map = null;
        this._map = map.copy();
    }

    get stage() {
        return this.store.stage;
    }

  


    injectCustomSettings(settings) {
        this._settings = settings;
    }

   
    initModel(map, pmap) {
        if (!pmap || pmap.model != map.model) {
            pmap = null; //can clear so everything else happens
            let url = (!map.model) ? "/route-core-default" : "/route-" + map.model;
            let data = {};
            if (map.to) data.__to = map.to;
            return client.get(url, data)
            .then(response => {
                if (response.__status != "SUCCESS") {
                    throw new Error(response);
                }
                this._response = response;
                if (!map.state) map.state = this._response.default_state;
                this._instance = new ModelInstance(this.store.stage);
                if (this._settings && this._settings[map.state]) {
                    this._instance.applySettings(this._settings[map.state]);
                }
            });

        } else {
            return Promise.resolve();
        }
    }


    init() {
        return this.initModel(this._map, this._previous_map)
        .then(() => {
            if (!this._previous_map || this._previous_map.state != this._map.state) {
                this._instance.initState(this._response, this._map.state);
                this._previous_map = null;
            }
        })
        .then(() => {
            if (!this._previous_map || this._previous_map.key != this._map.key || this._previous_map.param_str != this._map.param_str) {
                this._previous_map = null;
                return this._instance.initDataTemplate(this._map);
            }
        })
        .then(() => {
            if (this._previous_map) {
                if (this._previous_map.to != this._map.to) {
                    this._instance.to = this._map.to;
                    this._previous_map = null;
                }
            }
        })
        .then(() => {
            if (!this._previous_map) return this._instance.load(this._map.state);
        })
    }
    


   
    exportToStore() {
        return this._instance.exportToStore(this.map.state);
    }
}