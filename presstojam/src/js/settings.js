let _settings = {};


function flattenSettings(settings, prefix = "") {
    for(let i in settings) {
        if (typeof settings[i] === 'object') {
            flattenSettings(settings[i], prefix + i + ".");
        } else {
            _settings[prefix + i] = settings[i];
        }
    }
}
export function setSettings(settings) {
    flattenSettings(settings);
}

export function getSettings() {
    return _settings;
}

export function getSetting(name, def = null) {
    return (_settings.hasOwnProperty(name))  ? _settings[name] : def;
}