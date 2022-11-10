let _configs = {};


function flattenConfigs(configs, prefix = "") {
    for(let i in configs) {
        if (typeof configs[i] === 'object') {
            flattenConfigs(configs[i], prefix + i + ".");
        } else {
            _configs[prefix + i] = configs[i];
        }
    }
}
export function initConfigs(configs) {
    if (!configs.profile) {
        throw "Profile must be set in settings";
    }

    if (!configs.base) {
        throw "Url Base must be set in settings";
    }

    if (!configs.url) {
        throw "API url must be set in settings";
    }
    flattenConfigs(configs);
}

export default {
    set : function(key, val) {
        _configs[key] = val;
    },
    get : function(key, def = null) {
        return (_configs.hasOwnProperty(key))  ? _configs[key] : def;
    }
}
