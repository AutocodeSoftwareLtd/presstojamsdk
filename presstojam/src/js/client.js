
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
        const options = this.createOptions("PUT", this.createHeaders({"X-Force-Auth-Cookies" : 1}));
        return fetch(main_url + "/core/switch-tokens", options)
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

    save(url, method, data) {
        const headers = this.createHeaders();
        let body = null;
        if (data) {
            headers.set('Content-Type', 'application/json');
            body = JSON.stringify(data);
        }
        const options = this.createOptions(method, headers, body);
        //call our fetch response and return
        return this.call(url, options);
    },

    post(url, data) {
        return this.save(url, "POST", data);
    },

    put(url, data) {
        return this.save(url, 'PUT', url, data);
    },

    delete(url, data) {
        return this.save(url, 'DELETE', data);
    },

    patch(url, blob) {
        const options = this.createOptions("PATCH", this.createHeaders(), blob);
        return this.call(url, options);
    },

    getAsset(url) {
        const options = this.createOptions("GET", this.createHeaders());
    
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
