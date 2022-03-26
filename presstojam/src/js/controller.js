import { reactive } from "vue"
import { Model } from "./model.js"
import Map from "./ctrlmap.js"
import Client from "./client.js"
import Router from "./router.js"

let _store = reactive({ 'models' : [], profile : null });
let _settings = {};
let _models = [];
let _seeker = -1;


function setSettings(settings) {
    if (settings.client) {
        Client.setURL(settings.client.url);
        if (settings.client.custom_headers) {
            for(let i in settings.client.custom_headers) {
                Client.regCustomHeader(i, settings.client.custom_headers[i]);
            }
        }
    
        if (settings.client.debug) {
            Client.regDebug(true);
        }
    
        Client.regStatusHandler(403, function() {
            alert("Page not found");
        });
    }
    
    if (settings.mapper) {
        if (settings.mapper.base) Map.setBase(settings.mapper.base);
    }

    if (settings.models) _settings = settings.models;
}


function initProfile() {
    return Client.get("/core-check-user")
    .then(response => {
        _store.profile = response.__profile;
        return _store.profile;
    });
}

function assumeRole(role) {
    return Client.post('/core-assume-role', { 'role' : role })
    .then(request => {
        _store.profile = request.__profile;
        return _store.profile;
    });
}

function removeRole() {
    return Client.post('/core-remove-role')
    .then(request => {
        _store.profile = request.__profile;
        return _store.profile;
    });
}

function buildModel(map, stage) {
    let url = (!map.model) ? "/route-core-default" : "/route-" + map.model;
    let data = {};
    if (map.to) data.__to = map.to;
    return Client.get(url, data)
    .then(response => {
        if (response.__status != "SUCCESS") {
            throw new Error(response);
        }
        let model_name = response.model;
        let model = new Model();
        model.to = map.to;
        if (_settings[model_name]) model.injectCustomSettings(_settings[model_name]);
        model.mapResponse(response);
        model.state = map.state;
        model.key = map.key;
        
        model.stage = stage;
        _models[stage] = model;
        return model;
    })
    .then(model=> {
        return model.load();
    });
    
}

function run() {
    _seeker = -1;
    let maps = Map.getMaps();
    if (maps.length == 0) {
        throw new Error("Error with controller run, no maps created");
    }
    _store.models = [];
    let promises = [];

    if (_models.length > maps.length) _models.splice(maps.length, _models.length - maps.length);
    for (let i in maps) {
        const map = maps[i];
        let model, promise;
        if (i >= _models.length || _models[i].name != map.model) {
            promise = buildModel(map, i);
        } else {
            model = _models[i];
            if (model.state != map.state || model.key != map.key) {
                model.state = map.state;
                model.key = map.key;
            }
            promise = _models[i].load()
            .catch(e => console.log(e));
        }
        promises.push(promise);
    }

    //check the last map to see if it needs a child group
    //omap will be one before last
    Promise.all(promises)
    .then(() => {
        for(let model of _models) {
            _store.models.push(model);
        }
    })
    .catch(e => {
        console.log(e);
    })    
}

function buildLink() {
    Map.resetMaps();
    let omaps = [];
    let changes = [];
    for(let i in _models) {
        let model = _models[i];
        omaps.push(model.map);
        changes.push(model.change_intention);
    }

    for (let i =0,n=changes.length; i<n; ++i) {
        let change = changes[i];
        if (!change) continue;
        let ni = i + change.target;
        if (ni < 0) omaps.unshift({ ...omaps[i] });
        else if (ni >= omaps.length) omaps.push({ ... omaps[omaps.length - 1]});
        if (change.model) omaps[ni].model = change.model;
        if (change.state) omaps[ni].state = change.state;
        if (change.to) omaps[ni].to = change.to;
        if (change.key) omaps[ni].key = change.key;
        if (change.end) {
            omaps.splice(ni + 1, omaps.length);
            break;
        }
    }

    for(const omap of omaps) {
        let cmap = Map.createMap();
        for(let i in omap) {
            cmap[i] = omap[i];
        }
    }
    let url = Map.convertToURL();
    Router.setRoute(url);
}

function runLink() {
    Map.runRoute();
}


function runData(uri = null) {
    if (!uri) uri = window.location.pathname;
    Map.convertFromURL(uri);
}



function reloadFromBase() {
    Map.resetMaps();
    let url = Map.convertToURL();
    Router.setRoute(url);
}


function getStore() {
    return _store.models[_seeker].store;
}


function next() {
    ++_seeker;
}

Map.trigger(() => {
    run();
});

Router.regCallback(Map.convertFromURL)

export default {
    store : _store,
    models : _models,
    setSettings,
    initProfile,
    assumeRole,
    removeRole,
    run,
    buildModel,
    buildLink,
    runLink,
    runData,
    reloadFromBase,
    getStore,
    next
}
