let _configs = {};


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
    _configs = configs;
}

export default {
    set : function(key, val) {
        _configs[key] = val;
    },
    get : function(key, def = null) {
        const keys = key.split(".");
        const fkey = keys.pop();
        let obj = _configs;
    
        for(let key of keys) {
            if (!obj.hasOwnProperty(key)) return def;
            obj = obj[key];
        }

        return (obj.hasOwnProperty(fkey)) ? obj[fkey] : def;
    }
}
