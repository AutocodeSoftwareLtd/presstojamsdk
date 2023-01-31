import { Data } from "./data.js"

export class SingleData extends Data {


    constructor(model) {
        super(model);
        this._active_id = 0;

        this._model.limit = 1;
        this._model.order = {"--id" : "ASC"};
        this._data.value = {};
    }

    get type() {
        return "single";
    }

    get active_id() {
        return this._active_id;
    }
    
    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;
            this._load_promise = this._model.load();
        }
            
        this._load_promise.then(response => {
            this._is_loading.value = false;
            if (Array.isArray(response)) this._data.value = response.pop();
            else this._data.value = response;
            this._active_id = this._data.value['--id'];
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