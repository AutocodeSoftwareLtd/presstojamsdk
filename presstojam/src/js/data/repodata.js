import { Data } from "./data.js"
import { reactive } from "vue"


export class RepoData extends Data {


    constructor(model) {
        super(model);
        this._pagination = reactive({ 
            rows_per_page : this._model.limit, 
            count : 0, 
            offset : 0 
        });

        this._parent_id = null;
        this._order = {};
        this._filters = {};
    }


    get pagination() {
        return this._pagination;
    }

    get filters() {
        return this._filters;
    }

    get type() {
        return "repo";
    }

    get parent_id() {
        return this._parent_id;
    }

    set parent_id(id) {
        this._parent_id = id;
    }

    buildParams() {
        let filters = {... this._filters};
        if (this._parent_id) filters["--parent"] = this._parent_id;
        return filters;
    }

    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;
            let params = this._filt
            this._load_promise = this._model.loadCount(this.buildParams())
            .then(count => {
                this._pagination.count = count;
                return this._model.load(this.buildParams(), this._pagination.offset);
            });
        }
            
        this._load_promise.then(response => {
            this._is_loading.value = false;
            return response;
        })
        .catch(e => {
            console.log(e);
            this.is_loading.value = false;
            throw e;
        });
    
        return this._load_promise;
    }

    loadAll() {
        let ocount = this._model.limit;
        this._model.limit = 0;
        const promise = this._model.load(this.buildParams());
        this._model.limit = ocount; //reset original limit
        return promise;
    }


    reload(params) {
        this._selected.value = [];
        this._active.value = {};
        this.load_promise = null;
        return this.load(params);
    }

    overwrite(obj) {
        for(let row of this.data.value) {
            if (row['--id'] == obj['--id']) {
                for(let x in obj) {
                    row[x] = obj[x];
                }
            }       
        }
    }    

}