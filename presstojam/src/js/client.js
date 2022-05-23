import Settings from "./settings.js"

let custom_headers  = {};
let main_url;

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
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        });
    }, 
    get(url, data) {
        if (data) {
            const params = new URLSearchParams();
            for(let i in data) {
                if (Array.isArray(data[i]) || (typeof data[i] == 'object' && data[i] !== null)) {
                   params.append(i, JSON.stringify(data[i]));
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
        let headers = {};
        headers.method = 'POST';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    put(url, data) {
        let headers = {};
        headers.method = 'PUT';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    patch(url, data) {
        let headers = {};
        headers.method = 'PATCH';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    },

    delete(url, data) {
        let headers = {};
        headers.method = 'DELETE';
        headers.body = JSON.stringify(data);
        return this.run(url, headers);
    }
}
