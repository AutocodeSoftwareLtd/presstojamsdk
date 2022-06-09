let dictionary = {};

export function setDictionary(dict) {
    dictionary = dict;
}


export function getDictionary(id, vals) {
    let str = "";
    if (!vals) {
        if (dictionary[id]) str = dictionary[id];
        return str;
    }
    
    if (vals.model) {
        if (vals.field) {
            if (vals.field.indexOf("/") > -1) {
                let exp = vals.field.split("/");
                vals.model = exp[0];
                vals.field = exp[1];
            }
            
            if (dictionary.models[vals.model] && dictionary.models[vals.model].fields[vals.field]) {
                str= dictionary.models[vals.model].fields[vals.field][id];
            }
        } else {
            if ( dictionary.models[vals.model]) {
                str = dictionary.models[vals.model][id];
            }
        }
    } else if (vals.type) {
        if (dictionary[id][vals.type]) str = dictionary[id][vals.type];
        else str = dictionary[id].def;
    } else {
        str = dictionary[id];
    }

    if (vals.val) {
        str = str.replace( /\{\{(.*?)\}\}/g, vals.val);    

        //s.replace( /\{\{(.*?)\}\}/g, function(x){          // this grabs replacement tags
          //  return x.replace( /\[(\d+)\]/g,'.$1' )});      
    }

    if (!str && vals.default) str = vals.default;
    return str;
}