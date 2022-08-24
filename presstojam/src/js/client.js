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

    run(method, url, params, body) {
        const headers = new Headers();
        if (params) {
            headers.set('Content-Type', 'application/json');
            body = params;
        }

        for(let i in custom_headers) {
            headers.set(i, custom_headers[i]);
        }

        const options = {
            method  : method,
            mode : 'cors',
            cache : 'no-cache',
            credentials : 'include',
            headers  : headers,
            body : body
        }

        const _self = this;

        return fetch(main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status == 403) {
                let new_options = {...options};
                new_options.headers.set("X-Force-Auth-Cookies", 1);
                new_options.method = "PUT";
                return fetch(main_url + "/core/switch-tokens", new_options)
                .then(() => {
                    return fetch(main_url + url, options);
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
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
        return  this.run('GET', url);
    },

    getprimary(url, data) {
        return this.get(url, data);
    },

    post(url, data) {
        //call our fetch response and return
        return this.run('POST', url, JSON.stringify(data));
    },

    put(url, data) {
        return this.run('PUT', url, JSON.stringify(data));
    },

    patch(url, data) {
        return this.run('PATCH', url, null, data);
    },

    getAsset(url) {
        const headers = new Headers();
        for(let i in custom_headers) {
            headers.set(i, custom_headers[i]);
        }

        const options = {
            method  : 'GET',
            mode : 'cors',
            cache : 'no-cache',
            credentials : 'include',
            headers  : headers
        }

        const _self = this;

        return fetch(main_url + url, options)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw response;
            }
        });
    },

    delete(url, data) {
        return this.run('DELETE', url, JSON.stringify(data));
    }
}
