
let custom_headers  = {};
let main_url;

export default {

    initSettings(settings) {
        main_url = settings.url;
        if (settings.custom_headers) {
            for(let name in settings.custom_headers) {
                custom_headers[name] = settings.custom_headers[name];
            }
        }
    },

    getSettings() {
        return { 
            url : main_url,
            custom_headers
        }
    },

    createClientException(type, detail, response) {
        return { 
            "origin" : "client",
            type,
            detail,
            "status" : response.status,
            response 
        };
    },

    createHeaders(dynamic_headers = null) {
        const headers = new Headers();
        for(let i in custom_headers) {
            headers.set(i, custom_headers[i]);
        }

        if (dynamic_headers) {
            for(let i in dynamic_headers) {
                headers.set(i, dynamic_headers[i]);
            }
        }
        return headers;
    },

    createParams(data) {
        const params = new URLSearchParams();
        for(let i in data) {
            if (Array.isArray(data[i]) || (typeof data[i] == 'object' && data[i] !== null)) {
               params.append(i, JSON.stringify(data[i]));
            } else params.append(i, data[i]);
        }
        return params;
    },

    createOptions(method, headers, body = null) {
        return {
            method  : method,
            mode : 'cors',
            cache : 'no-cache',
            credentials : 'include',
            headers  : headers,
            body : body
        }
    },

    switchTokens() {
        const options = this.createOptions("PUT", this.createHeaders({"x-force-auth-cookies" : 1}));
        return fetch(main_url + "/user/switch-tokens", options)
    },

    call(url, options) {
        return fetch(main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw this.createClientException("error", "apierror", response);
            }
        });
    },

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
    },

    getprimary(url, data) {
        return this.get(url, data);
    },

    save(url, method, data, dynamic_headers = null) {
        const headers = this.createHeaders(dynamic_headers);
        let body = null;
        if (data) {
            body = data;
        }
        const options = this.createOptions(method, headers, body);
        //call our fetch response and return
        return this.call(url, options);
    },

    post(url, data, headers = null) {
        if (!(data instanceof FormData)) {
            data = JSON.stringify(data);
            if (!headers) headers = {};
            headers["Content-Type"] = "application/json";
        }
        
        return this.save(url, "POST", data, headers);
    },

    put(url, data, headers = null) {
        if (data instanceof FormData) {
            data = Object.fromEntries(data.entries());
        }
        data = JSON.stringify(data);
        if (!headers) headers = {};
        headers["Content-Type"] = "application/json";
        return this.save(url, 'PUT', data, headers);
    },

    delete(url, data) {
        return this.save(url, 'DELETE', data);
    },

    getAsset(url) {

        const options = this.createOptions("GET", { mode : 'no-cors'});
    
        return fetch(main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw response;
            }
        });
    }
    
}
