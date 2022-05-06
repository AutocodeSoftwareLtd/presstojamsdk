import Settings from "./settings.js"

let custom_headers  = {};
let main_url;
let status_handlers = {};
let debug = true;
let last_status;
let last_ok;

export default {

    initSettings() {
        const settings = Settings.getSettings("client");
        if (!settings.url) {
            throw("No URL defined for client");
        }
        main_url = settings.url;

        if (settings.custom_headers) {
            for(let name in settings.custom_headers) {
                custom_headers[name] = settings.custom_headers[name];
            }
        }

        if (settings.debug) {
            debug = settings.debug;
        }

        status_handlers[403] = function() {
            alert("Page not found");
        }

        if (settings.status_handlers) {
            for(let handler in status_handlers) {
                status_handlers[handler] = status_handlers[handler];
            }
        }
    },


    run(url, headers) {

        if (!main_url) {
            this.initSettings();
        }
        
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
            for(let i in data) {
                if (Array.isArray(data[i]) || (typeof data[i] == 'object' && data[i] !== null)) {
                   params.append(JSON.stringify(data[i]));
                } else params.append(i, data[i]);
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
