import configs from "./configs.js"

let _has_cookie = false;

function runCsrfCookie(url) {
    if (!_has_cookie) {
        _has_cookie = true;
        fetch(url + "/sanctum/csrf-cookie", {
            method  : 'GET',
            mode : 'cors',
            cache : 'no-cache',
            credentials : 'include',
        })
        .then(response => {
        })
        .catch(e => {

        });
    }
}

export class Client {

    constructor(url, headers = null) {
        this._main_url = url;
        this._custom_headers = {};
        if (headers) {
            for(let name in headers) {
                this._custom_headers[name] = headers[name];
            }
        }
        runCsrfCookie(this._main_url);
    }


    createClientException(type, detail, status, response) {
        return { 
            "origin" : "client",
            type,
            detail,
            status,
            response 
        };
    }

    createHeaders(dynamic_headers = null) {
        const headers = new Headers();
        for(let i in this._custom_headers) {
            headers.set(i, this._custom_headers[i]);
        }

        if (dynamic_headers) {
            for(let i in dynamic_headers) {
                headers.set(i, dynamic_headers[i]);
            }
        }
        return headers;
    }

    createParams(data) {
        const params = new URLSearchParams();
        for(let i in data) {
            if (Array.isArray(data[i]) || (typeof data[i] == 'object' && data[i] !== null)) {
               params.append(i, JSON.stringify(data[i]));
            } else params.append(i, data[i]);
        }
        return params;
    }

    createOptions(method, headers, body = null) {
        return {
            method  : method,
            mode : 'cors',
            cache : 'no-cache',
            credentials : 'include',
            headers  : headers,
            body : body
        }
    }


    call(url, options) {
        return fetch(this._main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(json => {
                    throw this.createClientException("error", "apierror", response.status, json);
                });
            }
        });
    }

    get(url, data) {
        if (data) {
            const params = this.createParams(data);
            if (url.indexOf("?") == -1) url += "?";
            else url += "&";
            url += params.toString();
        }
        return  this.call(url, this.createOptions(
            'GET', 
            this.createHeaders())
        );
    }

    getprimary(url, data) {
        return this.get(url, data);
    }

    save(url, method, data, dynamic_headers = null) {
        const headers = this.createHeaders(dynamic_headers);
        let body = null;
        if (data) {
            body = data;
        }
        const options = this.createOptions(method, headers, body);
        //call our fetch response and return
        return this.call(url, options);
    }

    post(url, data, headers = null) {
        if (!(data instanceof FormData)) {
            if (!headers) headers = {};
            data = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        }        
        return this.save(url, "POST", data, headers);
    }

    put(url, data, headers = null) {
        if (data instanceof FormData) {
            data = Object.fromEntries(data.entries());
        }
        data = JSON.stringify(data);
        if (!headers) headers = {};
        headers["Content-Type"] = "application/json";
        return this.save(url, 'PUT', data, headers);
    }

    delete(url, data) {
        const headers = {"Content-Type" : "application/json"};
        return this.save(url, 'DELETE', JSON.stringify(data), headers);
    }

    getAsset(url) {

        const options = this.createOptions("GET");
    
        return fetch(this._main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw response;
            }
        });
    }
    
}


export class ClientAPI {

    constructor() {
        this._type = configs.get("apitype");
    }

    get(model, params) {
        const client = getClient();
        if (this._type == "slim") {
            return client.get("/data/" + model, params);
        } else {
            return client.get("/" + model, params);
        }
    }

    active(model, id) {
        const client = getClient();
        if (this._type == "slim") {
            return client.get("/data/" + model + "/active", {"--id" : id});
        } else {
            return client.get("/" + model + "/" + id);
        }
    }

    create(model, params) {
        const client = getClient();
        if (this._type == "slim") {
            return client.post("/data/" + model, params);
        } else {
            return client.post("/" + model, params);
        }
    }

    update(model, id, params) {
        const client = getClient();
        if (this._type == "slim") {
            params["--id"] = id;
            return client.put("/data/" + model, params);
        } else {
            return client.put("/" + model + "/" + id, params);
        }
    }

    destroy(model, id) {
        const client = getClient();
        if (this._type == "slim") {
            return client.delete("/data/" + model, {"--id" : id});
        } else {
            return client.delete("/" + model + "/" + id);
        }
    }

    destroyMany(model, params) {
        const client = getClient();
        if (this._type == "slim") {
            return client.delete("/data/" + model, params);
        } else {
            return client.delete("/" + model, params);
        }
    }

    import(model, params) {
        const client = getClient();
        if (this._type == "slim") {
            return client.import("/data/" + model, params);
        } else {
            return client.import("/" + model, params);
        }
    }

    resort(model, params) {
        const client = getClient();
        if (this._type == "slim") {
            return client.put("/data/" + model, params);
        } else {
            return client.put("/" + model + "/resort", params);
        }
    }

    reference(model, field, id) {
        const client = getClient();
        if (this._type == "slim") {
            let url = "/reference/" + model + "/" + field;
            if (id) url += "/" + id;
            return client.get(url, params);
        } else {
            let url = "/" + model + "/" + field;
            if (id) url += "/" + id;
            return client.get(url, params);
        }
    }

    getAsset(model, field, id) {
        const client = getClient();
        if (this._type == "slim") {
            return client.get("/asset/" + model + "/" + field + "/" + id, params);
        } else {
            return client.get( "/" + model + "/" + field + "/" + id, params);
        }
    }

    login(email, password, type) {
        const client = getClient();
        if (this._type == "slim") {
            return client.post("/user/login/" + type, {"email":email, "password":password }, {"Accept" : 'application/json'});
        } else {
            return client.post("/user/login", {"email":email, "password":password }, {"Accept" : 'application/json'});
        }
    }

    checkUser() {
        const client = getClient();
        return client.get("/user/check-user");
    }

}


export function getClient() {
    return new Client(configs.get("url"), configs.get("client.custom_headers", {}));
}