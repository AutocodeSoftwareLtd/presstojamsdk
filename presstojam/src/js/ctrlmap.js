import Params from "./params.js"


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
    }

    set model(model) {
        this._model = model;
    }

    set state(state) {
        this._state = state;
    }

    set key(key) {
        this._key = key;
    }

    set to(to) {
        this._to = to;
    }

    get model() {
        return this._model;
    }

    get state() {
        return this._state;
    }

    get key() {
        return this._key;
    }

    get to() {
        return this._to;
    }

    swap(map) {
        this._model = map.model;
        this._state = map.state;
        this._key = map.key;
        this._to = map.to;
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
let route_base = "";
let params = {};

function regParam(name, val) {
    params[name] = val;
}

function removeParam(name) {
    delete params[name];
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
    let url = route_base + "/" + str_parts.join("/");

    const param_str = Params.encodeParams(params);
    if (param_str) url += "?" + param_str;

    return url;
}

function convertFromURL(url) {
    url = url.replace(route_base, "");
    url = url.replace(/^\/+|\/+$/g, '');
    let parts = url.split("/");
    maps = [];
    for(let i in parts) {
        let map = createMap();
        map.convertFromURL(parts[i]);
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