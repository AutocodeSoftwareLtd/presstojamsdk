export class Reports {

    constructor() {
        this._scale = null;
        this._has_scale = false;
        this._agg_type;
        this._field;
        this._model;
        this._group;
        this._filters;
        this._results;
        this._active;

        const keys = Object.keys(this);
       
        keys.forEach(property => {
            if (property[0] == "_") {
                Object.defineProperty(this, property.substring(1), {
                    get: function() { 
                        return this[property];
                    },
                    set: function(val) {
                        this[property] = val;
                    }
                });
            }
        });
    }


    run(client) {

    }

    getResults() {

    }
}