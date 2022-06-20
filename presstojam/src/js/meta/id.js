import { Field } from "./field.js"

class ID extends Field {

    constructor(name, obj) {
        super(name, obj);
        this._reference = "";
        this._summary_fields = [];
        this._recursive = false;
    }


    setReferenceOptions(url, params) {
        this._store.options = [];
        return Client.get(url, params)
        .then(response => {
            for (let i in response) {
                let key = response[i]["--id"];
                let vals = [];
                for(let x  in response[i]) {
                    if (x != "--id") {
                        vals.push(response[i][x]);
                    }
                }
                this._store.options.push({ key: key, value: vals.join(" ", vals) });
            }
        })
        .catch(e => {
            console.log(e);
        });
    }

}