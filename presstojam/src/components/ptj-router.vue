<template>
    <ptj-model v-for="map in maps" :map="map" :key="map.id"  />    
</template>
<script setup>

import Events from "./../js/events.js"
import Settings from "./../js/settings.js"
import { ref } from "vue"
import PtjModel from "./ptj-model.vue"


let route_base = '';
let maps = ref([]);

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
        target : 0,
        settings : {}
    }
}


function convertToURL(map) {
    let model = map.model;
    let state = map.state;
    let key = map.key;
    let to = map.to;

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
    map.id = map.model + "-" + map.state + "-" + map.to;
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
    maps.value = [];
    for(let i in parts) {
        let map = convertFromURL(parts[i]);
        if (!map) continue;
        map.stage = i;
        const param = url_obj.searchParams.get("stage_" + i);
        if (param) map.param_str = param
        maps.value.push(map);
    }

    if (maps.length == 0) {
        let map = createMap();
        maps.value.push(map);
    }
}



function redirect(change, map, soft=false) {
    let ni = parseInt(map.stage) + parseInt(map.target);
    if (ni < 0) maps.value.unshift({ ...maps[0] });
    else if (ni >= maps.length) maps.value.push({ ...maps[maps.length - 1]});

    for(let i in change) {
        if (change[i] !== null) {
            if (i == "_end") maps.value.splice(ni + 1, maps.length);
            else maps.value[ni][i] = change[i];
        }
    }


    let url_parts = [];
    for(let map of maps.value) {
        url_parts.push(convertToURL(map));
    }

    const base = new URL(window.location.protocol + "//" + window.location.host +  route_base);
    const url_str = url_parts.join("/");
    const url = new URL(url_str, base);

    for(let i in maps.value) {
        if (maps.value[i].param_str) {
            url.searchParams.set("stage_" + i, maps.value[i].param_str);
        }
    }

    window.history.pushState({'name' : url.pathname}, document.title, url);
    if (!soft) runRoute(url);
}

Events.on("redirect", data => {
    redirect(data.change, data.map);
});

Events.on("history", data => {
    redirect(data.change, data.map, true);
});

Events.on("reload", () => {
    location.href = route_base;
});


const settings = Settings.getSettings("mapper");
if (settings) {
    route_base = "/" + settings.base.replace(/^\/+|\/+$/g, '');
}
runRoute();

</script>