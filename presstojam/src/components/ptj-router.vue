<template>
    <ptj-model v-for="map in maps" :map="map" :key="map.id" @redirect="redirect" :settings="map.settings" />    
</template>
<script setup>

defineProps({
    route_base : String
});

let maps = reactive([]);

const action_map = {
    'post' : '-create',
    'put' : '-update',
    'delete' : '-delete',
    'login' : '-login',
    'logout' : '-logout',
    'primary' : '-primary',
    'parent' : '-parent',
    'get' : ''
};

function createMap() {
    return {
        model : '',
        state : '',
        key : 0,
        to : '',
        param_str : '',
        id : '',
        stage : 0,
        settings : {}
    }
}


function convertToURL(map) {
    let model = map.model;
    let state = map.state;
    let key = map.key;
    let to = mapto;

    let url = model + action_map[state];
    if (key) url += "-" + key;
    if (to) url += "-to-" + to;
    return url;
}

function convertFromURL(url) {
    let map = createMap();
    if (!url) return;
    let parts = url.split("-to-");
    if (parts.length > 1) {
        map.to = parts[1];
        url = parts[0];
    }
    parts = url.split("-");
    let key = parts[parts.length - 1];
    if (key == "first") {
        map.key = key;
        parts.pop();
    } else if (!isNaN(key)) {
        map.key = key;
        parts.pop();
    }
        
    if (parts.length == 0) {
        throw new Error("Can't convert this url string: " + url);
    }

    map.state = "get";
    for(let i in action_map) {
        if (action_map[i] == "-" + parts[parts.length - 1]) {
            map.state = i
            parts.pop();
            break;
        }
    }
    map.model = parts.join("-");
    map.id = model.model + "-" + model.state + "-" + model.to;
    return map;
}



window.onpopstate = function(event) {
    runRoute(new URL(document.location.href));
}


function runRoute(url_obj = null) {
    if (!url_obj) url_obj = new URL(window.location.href);
    let url = url_obj.pathname.replace(route_base, "");
    url = url.replace(/^\/+|\/+$/g, '');
    let parts = url.split("/");
    maps = [];
    for(let i in parts) {
        let map = convertFromURL(parts[i]);
        const param = url_obj.searchParams.get("stage_" + i);
        if (param) map.param_str = param
        maps.push(map);
    }
}



function redirect(change, target, soft=false) {
    let ni = change.stage + target;
    if (ni < 0) maps.unshift({ ...maps[0] });
    else if (ni >= maps.length) maps.push({ ...maps[maps.length - 1]});

    for(let i in change) {
        if (change[i] !== null) {
            if (i == "_end") maps.splice(ni + 1, maps.length);
            else maps[ni][i] = change[i];
        }
    }


    let url_parts = [];
    for(let map of maps) {
        url_parts.push(convertToURL(map));
    }

    const base = new URL(window.location.protocol + "//" + window.location.host + "/" +  props.route_base.replace(/^\/+|\/+$/g, '') + "/");
    const url_str = url_parts.join("/");
    const url = new URL(url_str, base);

    for(let i in maps) {
        if (maps[i].param_str) {
            url.searchParams.set("stage_" + i, maps[i].param_str);
        }
    }

    window.history.pushState({'name' : uri.pathname}, document.title, url);
    if (!soft) runRoute(url);
}

</script>