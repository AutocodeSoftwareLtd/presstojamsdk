const action_map = {
    'post' : '-create',
    'put' : '-update',
    'delete' : '-delete',
    'login' : '-login',
    'logout' : '-logout',
    'getprimary' : '-primary',
    'get' : ''
};

class CtrlGroupMap {

    constructor() {
        this._model;
        this._state = "";
        this._key = 0;
        this._to;
        this._param_str;
    }

    set model(model) {
        this._model = model;
    }

    get model() {
        return this._model;
    }

    set state(state) {
        this._state = state;
    }
    
    get state() {
        return this._state;
    }

    set key(key) {
        this._key = key;
    }

    get key() {
        return this._key;
    }

    set to(to) {
        this._to = to;
    }

    get to() {
        return this._to;
    }

    set param_str(str) {
        this._param_str = str;
    } 

    get param_str() {
        return this._param_str;
    }

    copy() {
        return {
            model : this._model,
            state : this._state,
            key : this._key,
            to : this._to,
            param_str : this._param_str
        }
    }


    convertToURL() {
        let model = this._model;
        let state = this._state;
        let key = this._key;
        let to = this._to;

        let url = model + action_map[state];
        if (key) url += "-" + key;
        if (to) url += "-to-" + to;
        return url;
    }

    convertFromURL(url) {
        if (!url) return;
        let parts = url.split("-to-");
        if (parts.length > 1) {
            this._to = parts[1];
            url = parts[0];
        }
        parts = url.split("-");
        let key = parseInt(parts[parts.length - 1]);
        if (isNaN(key)) this._key = 0;
        else {
            parts.pop();
            this._key = key;
        }
        
        if (parts.length == 0) {
            throw new Error("Can't convert this url string: " + url);
        }
        for(let i in action_map) {
            if (action_map[i] == "-" + parts[parts.length - 1]) {
                this._state = i
                parts.pop();
                break;
            }
        }
        this._model = parts.join("-");
    }
}

let maps = [];
let trigger_cb = null;
let route_base = "/";


function decodeParams(param_str) {
    const params = new URLSearchParams(param_str);
    let param_obj = {};
    params.forEach(function(value, key) {
        param_obj[key] = value;
    });
    return param_obj;
} 




function resetMaps() {
    maps = [];
}

function trigger(trig) {
    trigger_cb = trig;
}

function createMap() {
    let map = new CtrlGroupMap();
    maps.push(map);
    return map;
}

function convertToURL() {
    let str_parts = [];
    for(let map of maps) {
        str_parts.push(map.convertToURL());
    }

    const base = new URL(window.location.protocol + "//" + window.location.host + route_base);
    const url_str = str_parts.join("/");
    const url = new URL(url_str, base);


    let cstr = [];
    for(let i in maps) {
        if (maps[i].param_str) {
            url.searchParams.set("stage_" + i, maps[i].param_str);
        }
    }
    return url;
}

function convertFromURL(url_obj) {
    let url = url_obj.pathname.replace(route_base, "");
    url = url.replace(/^\/+|\/+$/g, '');
    let parts = url.split("/");
    maps = [];
    for(let i in parts) {
        let map = createMap();
        map.convertFromURL(parts[i]);
    }

    const param_obj = url_obj.searchParams;
    for(let i in maps) {
        const param = param_obj.get("stage_" + i);
        if (param) maps[i].param_str = param;
    }

    if (trigger_cb) trigger_cb();
}


function setBase(base) {
    //trim any leading or trailing / so we can be sure we are dealing with the correct format
    base = base.replace(/^\/+|\/+$/g, '');
    route_base = "/" + base;
}

function getMaps() {
    return maps;
}


export default {
    trigger,
    resetMaps,
    createMap,
    convertToURL,
    convertFromURL,
    setBase,
    getMaps
}