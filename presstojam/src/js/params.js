function decodeParams() {
    const params = new URLSearchParams(window.location.search);
    let param_obj = {};
    params.forEach(function(value, key) {
        if (key == "graph") {
            let graph_obj = JSON.parse(decodeURIComponent(value));
            param_obj = { ...param_obj, ...graph_obj};
        } else {
            param_obj[key] = value;
        }
    });
    return param_obj;
} 


function encodeParams(params) {
    let graph = {};
    let cstr = [];
    for(let i in params) {
        if (typeof params[i] === 'object' && params[i]) {
            graph[i] = params[i];
        } else if (Array.isArray(params[i])) {
            graph[i] = params[i];
        } else {
            cstr.push(i + "=" + encodeURIComponent(params[i]));
        }
    }

    if (Object.keys(graph).length > 0) cstr.push( "graph=" + encodeURIComponent(JSON.stringify(graph)));
    return cstr.join("&");
}

function mapParams(url, params) {
    for(let i in params) {
        const key = "${" + i + "}";
        const regex = new RegExp(key, "g");
        url = url.replace(regex, params[i]);
    }
    return url;
}

export default {
    encodeParams,
    decodeParams,
    mapParams
}