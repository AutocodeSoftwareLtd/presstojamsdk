import { Data } from "./data.js"

export class ActiveData extends Data {


    constructor(model, active_id) {
        super(model);
        this._active_id = active_id;
    }

    get type() {
        return "active";
    }

    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;
            this._load_promise = this._model.loadActive({"--id" : this._active_id});
        }
            
        this._load_promise.then(response => {
            this._is_loading.value = false;
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
        for(let x in obj) {
            this.data.value[x] = obj[x];  
        }
    }    

}