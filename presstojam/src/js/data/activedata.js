import { Data } from "./data.js"

export class ActiveData extends Data {


    constructor(model, active_id) {
        super(model);
        this._active_id = active_id;
    }


    load() {
        if (!this.load_promise) {
            this.is_loading.value = true;
            this.load_promise = this._model.load({"--id" : this._active_id});
        }
            
        this.load_promise.then(response => {
            this.is_loading.value = false;
            return response;
        })
        .catch(e => {
            console.log(e);
            this.is_loading.value = false;
            throw e;
        });
    
        return this.load_promise;
    }


    reload() {
        this._active.value = {};
        this.load_promise = null;
        return this.load();
    }

    overwrite(obj) {
        for(let x in obj) {
            this.data.value[x] = obj[x];  
        }
    }    

}