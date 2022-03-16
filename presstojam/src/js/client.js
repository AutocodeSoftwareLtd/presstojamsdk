let custom_headers  = {};
let main_url;
let status_handlers = {};
let debug = true;
let last_status;
let last_ok;

export default {

    regCustomHeader(name, value) {
        custom_headers[name] = value;
    },

    regStatusHandler(status, handler) {
        status_handlers[status] = handler;
    },

    setURL(url) {
        main_url = url;
    },
    regDebug(is_debug) {
        debug = is_debug;
    },

    run(url, headers) {
        
        headers.mode = 'cors';
        headers.cache = 'no-cache';
        headers.credentials = 'include';
        headers['Content-Type'] = 'application/json';
        headers.headers = custom_headers;

        const _self = this;

        return fetch(main_url + url, headers)
        .then(response => {
            last_status = response.status;
            last_ok = response.ok;
            if (status_handlers[response.status]) {
                status_handlers[response.status](response);
            } else if (response.status == 401) {
                return response.status;
            } else {
                return response.json();
            }
        })
        .then(val => {
            if (!last_ok) throw val;

            if (last_status == 401) {
                let omethod = headers.method;
                headers.method = 'PUT';
                return fetch(main_url + "/core-switch-tokens", headers)
                .then(response => {
                    if (response.ok) {
                        headers.method = omethod;
                        return fetch(main_url + url, headers)
                        .then(response=> {
                            if (response.status == 401) {
                                throw new Error("Issue with refresh token");
                            } else if (response.ok) {
                                return response.json();
                            } else {
                              //  profile.updateUser("public", 0);
                              //  throw Error("Logged out");
                            }
                        });
                    } else {
                       // profile.updateUser("public", 0);
                       // throw Error("Logged out");
                    }
                });
            } else return val;
        })
        .catch(err => {
            if (debug) console.log(err);
            throw err;
        });
    }, 
    setDebug(data) {
        if (!data) {
            data = {"__debug" : true}
        } else {
            data["__debug"] = true;
        }
        return data;
    },
    get(url, data) {
        if (debug) data = this.setDebug(data);
        if (data) {
            const params = new URLSearchParams();
            let graph = {};
            for(let i in data) {
                if (Array.isArray(data[i]) || (typeof data[i] == 'object' && data[i] !== null)) graph[i] = data[i];
                else params.append(i, data[i]);
            }

            if (graph) {
                params.append("graph", JSON.stringify(graph));
            }
            if (url.indexOf("?") == -1) url += "?";
            else url += "&";
            url += params.toString();
        }
        let headers = {};
        headers.method = 'GET';
        return  this.run(url, headers);
    },

    getprimary(url, data) {
        return this.get(url, data);
    },

    post(url, data) {
        //call our fetch response and return
        if (debug) data = this.setDebug(data);
        let headers = {};
        headers.method = 'POST';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    put(url, data) {
        if (debug) data = this.setDebug(data);
        let headers = {};
        headers.method = 'PUT';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    patch(url, data) {
        if (debug) data = this.setDebug(data);
        let headers = {};
        headers.method = 'PATCH';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    delete(url, data) {
        if (debug) data = this.setDebug(data);
        let headers = {};
        headers.method = 'DELETE';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    }
}
