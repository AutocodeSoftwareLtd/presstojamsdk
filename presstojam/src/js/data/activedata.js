import { Data } from "./data.js"

export class ActiveData extends Data {


    constructor(model, active_id) {
        super(model);
        this._active_id = active_id;
        this._data.value = {};
    }

    get type() {
        return "active";
    }

    get active_id() {
        return this._active_id;
    }
    
    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;
            this._load_promise = this._model.loadActive({"--id" : this._active_id});
        }
            
        this._load_promise.then(response => {
            this._is_loading.value = false;
            this._data.value = response;
            return response;
        })
        .catch(e => {
            console.log(e);
            this._is_loading.value = false;
            throw e;
        });
    
        return this._load_promise;
    }


    reload() {
        this._active.value = {};
        this._load_promise = null;
        return this.load();
    }

    overwrite(obj) {
        for(let i in obj) {
            this._data.value[i] = obj[i];
        }  
    } 

}