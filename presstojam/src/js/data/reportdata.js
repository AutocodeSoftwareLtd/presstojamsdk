import { Data } from "./data.js"

export class ReportData extends Data {


    constructor(model, field) {
        super(model);
        this._aggregate = null;
        this._filters = [];
        this._field = field;
        this._aggregate = "COUNT";
        this._groups = [];
        this._time_group;
        this._load_line_promise = null;
        this._data.value = [];
    }

    get filters() {
        return this._filters;
    }

    set filters(filters) {
        this._filters = filters;
    }

    get groups() {
        return this._groups;
    }

    set groups(groups) {
        this._groups = groups;
    }

    get aggregate() {
        return this._aggregate;
    }

    set aggregate(agg) {
        this._aggregate = agg;
    }

    set timegroup(timegroup) {
        this._time_group = timegroup;
    }

    get field() {
        return this._field;
    }

    get type() {
        return "report";
    }

    getDataSets(response) {
        const data_sets = {};
        if (response.length == 0) return data_sets;
        if (this._groups.length == 0) {
            data_sets["main"] = [response[0].count];
        } else {
            for(const row of response) {
                let keys = [];
                for(const group of this._groups) {
                    keys.push(group + ":" + row[group]);
                }

                const key = keys.join(", ");
                if (!data_sets[key]) data_sets[key] = [];
                data_sets[key].push(row.count);
            }
        }
        return data_sets;
    }


    load(type) {
        if (!this._load_promise) {
            this._is_loading.value = true;
            this._model.limit = 0;
            const groups = {... this._groups};
            if (type == 'line') {
                if (this._time_group) {
                    groups.push({
                        name : '--created',
                        func : 'DATEPART',
                        args : {}
                    });
                }
            }
            this._model.group = groups;
            
            this._load_promise = this._model.loadReport(this._filters, this._field, this._aggregate)
            .then(response => {
                const data = this.getDataSets(response);
                const datasets = [];
              
                for(const key in data) {
                    datasets.push({
                        label : key,
                        data : data[key]
                    });
                }
    
                this._is_loading.value = false;
                this._data = datasets;
                return this._data;
            })
            .catch(e => {
                console.log(e);
                this._is_loading.value = false;
                throw e;
            });
        }
            
        return this._load_promise;
    }

    reload(type) {
        return this.load(type);
    }

}