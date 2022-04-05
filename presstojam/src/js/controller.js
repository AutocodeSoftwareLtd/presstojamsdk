import { reactive } from "vue"
import { Model } from "./model.js"
import Map from "./ctrlmap.js"
import Client from "./client.js"
import Router from "./router.js"
import ChangeAction from "./changeaction.js"

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
    let model = new Model(stage);
    model.map = map;
    if (_settings[map.model]) model.injectCustomSettings(_settings[map.model]);
    _models[stage] = model;
    return _models[stage];
   
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
            model = buildModel(map, i);
        } else {
            model = _models[i];
        }
        if (_settings && _settings[map.model]) {
            model.injectCustomSettings(_settings[map.model]);
        }
        promise = model.init()
        .catch(e => console.log(e));
        promises.push(promise);
    }

    //check the last map to see if it needs a child group
    //omap will be one before last
    Promise.all(promises)
    .then(() => {
        for(let model of _models) {
            _store.models.push(model.exportToStore());
        }
    })
    .catch(e => {
        console.log(e);
    })    
}

function buildLink(soft = false) {
    Map.resetMaps();
    let omaps = [];
    for(let i in _models) {
        let model = _models[i];
        omaps.push(model.map);
    }

    ChangeAction.convertMaps(omaps);

    for(const omap of omaps) {
        let cmap = Map.createMap();
        for(let i in omap) {
            cmap[i] = omap[i];
        }
    }
    let url = Map.convertToURL();
    if (!soft) Router.setRoute(url);
    else Router.softRoute(url);
}

function runLink() {
    Map.runRoute();
}


function runData(uri = null) {
    if (!uri) uri = new URL(window.location.href);
    Map.convertFromURL(uri);
}



function reloadFromBase() {
    Map.resetMaps();
    let url = Map.convertToURL();
    Router.setRoute(url);
}


function getStore() {
    return _store.models[_seeker];
}


function next() {
    ++_seeker;
}

Map.trigger(() => {
    run();
});


function runRoute(method, url, params) {
    return Client[method](url, params);
}

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
    next,
    runRoute
}
