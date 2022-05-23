let dictionary = {};

export function setDictionary(dict) {
    dictionary = dict;
}

export function getModelDictionary(cat, key, def) {
    if (dictionary[cat] && dictionary[cat][key]) {
        return dictionary[cat][key];
    } else {
        return def;
    }
}


export function getFieldDictionary(field, key, def) {
    if (!dictionary.fields[field]) return def;
    const dfield = dictionary.fields[field];
    if (dfield[key]) return dfield[key];
    else return def;
}