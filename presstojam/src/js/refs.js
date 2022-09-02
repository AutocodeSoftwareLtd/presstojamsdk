import Client from "./client.js"


class RefStore {
    constructor(model, field, params = {}) {
        this._model = model;
        this._field = field;
        this._params = params;
        this._load_promise = false;
       
        
        const keys = Object.keys(this);
       
        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                   return this[property];
                },
                set: function(newValue) {
                    this[property] = newValue;
                }
            })
          }
        });
    }

    buildParams() {
        let params = {};
        if (this._params["--parentid"]) params["--parentid"] = this._params["--parentid"];
        return params;
    }

    load() {
        if (!this._load_promise) {
            this._load_promise = Client.get("/reference/" + this._model + "/" + this._field, this.buildParams())
            .then(response => {
                return response;
            });
        }
        return this._load_promise;
    }
    
}

const source = {};


//need to add in search params and data settings



export function getReference(model, field, params) {
    let name = model + "-" + field;
    if (params["--parentid"]) name += "-" + params["--parentid"];
    if (!source[name]) {
        source[name] = new RefStore(model, field, params);
    }
    return source[name];
};

