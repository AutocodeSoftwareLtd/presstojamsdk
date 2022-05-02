let settings = {};

function regSettings(isettings, type = null) {
    if (!type) settings = isettings;
    else settings[type] = isettings;
}


function getSettings(type) {
    return settings[type];
} 


function getModelSettings(model, state) {
    if (settings.models && settings.models[model] && settings.models[model][state]) {
        return settings.models[model][state];
    }
    return {};
}

export default {
    regSettings,
    getSettings,
    getModelSettings
}