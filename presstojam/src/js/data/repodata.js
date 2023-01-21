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
        this._count_promise = null;
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
        if (this._pagination.rows_per_page) {
            filters.__offset = this._pagination.offset;
        }
        return filters;
    }

    setPagination(offset) {
        this._pagination.offset = offset;
        return this.reload();
    }

    hasPagination() {
        return (this._pagination.rows_per_page) ? true : false;
    }

    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;
            if (!this._count_promise) {
                this._count_promise = this._model.loadCount(this.buildParams())
                .then(count => {
                    this._pagination.count = count;
                });
            }

            this._load_promise = this._count_promise
            .then(() => {
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
        this._load_promise = null;
        return this.load(params);
    }

    overwrite(obj) {
        this._load_promise = this._load_promise
        .then(response => {
            for(const row of response) {
                if (row['--id'] == obj['--id']) {
                    for(let x in obj) {
                        row[x] = obj[x];
                    }
                }
            }      
            return response; 
        });
    }
    
    remove(ids) {
        this._load_promise = this._load_promise
        .then(response => {
            response.filter(function(item) {
                return !ids.include(item['--id']);
            });
            return response;
        });
    }


    append(obj) {
        this._load_promise = this._load_promise
        .then(response => {
            response.push(obj);
            return response;
        });
    }

}