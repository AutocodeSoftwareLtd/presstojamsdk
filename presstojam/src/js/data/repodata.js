import { Data } from "./data.js"

export class RepoData extends Data {


    constructor(model) {
        super(model);
        this._pagination = reactive({ 
            rows_per_page : this._model.limit, 
            count : 0, 
            offset : 0 
        });

        this._selected = ref([]);

        this._order = {};
        this._filters = reactive({});
    }



    load() {
        if (!this.load_promise) {
            this.is_loading.value = true;
            this.load_promise = this._model.loadCount(this._filters)
            .then(count => {
                this.pagination.count = count;
                return this._model.load(this._filters, this._pagination.offset);
            });
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

    loadAll() {
        let ocount = this._model.limit;
        this._model.limit = 0;
        const promise = this._model.load(this._filters);
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