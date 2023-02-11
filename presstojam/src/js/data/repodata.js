import { Data } from "./data.js"
import { ref } from "vue"


export class RepoData extends Data {


    constructor(model) {
        super(model);
        this._pagination = { 
            rows_per_page : this._model.limit, 
            count : ref(0), 
            page : 0 
        };

        this._parent_id = null;
        this._order = {};
        this._filters = {};
        this._count_promise = null;
        this._data.value = [];
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


    buildParams(all = false) {
        let filters = {... this._filters};
        if (this._parent_id) filters["--parent"] = this._parent_id;
        if (this._pagination.rows_per_page && !all) {
            filters.__offset = this._pagination.page * this._pagination.rows_per_page;
        }
        return filters;
    }

    setPagination(page) {
        this._pagination.page = page;
        return this.reload();
    }

    hasPagination() {
        return (this._pagination.rows_per_page) ? true : false;
    }

    count() {
        if (!this._count_promise) {
            this._count_promise = this._model.loadCount(this.buildParams())
            .then(count => {
                this._pagination.count.value = count;
            });
        }
        return this._count_promise;
    }

    load() {
        if (!this._load_promise) {
            this._is_loading.value = true;

            this._load_promise = this.count()
            .then(() => {
                return this._model.load(this.buildParams(), this._pagination.offset);
            });
        }
            
        this._load_promise.then(response => {
            this._data.value = response;
            this._is_loading.value = false;
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
        const promise = this._model.load(this.buildParams(true));
        this._model.limit = ocount; //reset original limit
        return promise;
    }


    reload(params) {
        this._load_promise = null;
        return this.load(params);
    }


    addRow(iobj) {
        return this._model.reloadRow(iobj['--id'])
        .then(response => {
            this._data.value.push(response);
        });
    }

    editRow(id) {
        return this._model.reloadRow(id)
        .then(response => {
            for(const i in this._data.value) {
                if (this._data.value[i]['--id'] == response['--id']) {
                    this._data.value[i] = response;
                }
            }
        });
    }
    
    remove(ids) {
        this._data.value.filter(function(item) {
            return !ids.include(item['--id']);
        });

    }

}