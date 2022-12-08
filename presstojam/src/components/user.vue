<template>
    <PtjAccountHandler v-if="require_login" />
    <div v-else>
        <Teleport :to="teleport">
            <div class="ptj-users">
                <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">{{ name }}</Button>
                <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
            </div>
        </Teleport>
        <PtjRoutes />
    </div>
</template>
<script setup>
import Menu from 'primevue/menu';
import { ref, inject } from 'vue';
import { getRoutesByProfile } from "../js/routes.js"
import configs from "../js/configs.js"
import Button from "primevue/button"
import { loadSiteMap } from "../js/routes.js"

import PtjAccountHandler from "./login/login.vue"
import PtjRoutes from './routes.vue'


const _profile = configs.get("profile");

const user_check = 600000;


const menu = ref();
const name = ref("");
const items = ref([]);
const teleport = configs.get("user.teleport", "body");

const client = inject("client");
const i18n = inject("i18n");
const router = inject("router");

const require_login = ref(false);

const toggle = (event) => {
    menu.value.toggle(event);
};

function logout()  {
    return client.post("/user/logout", {'x-force-auth-cookies' : 1})
    .then(() => {
        location.href = configs.get("base") + "/";
    });
}


function loadRoutes() {
    const base = configs.get("base");

    return client.get("/user/site-map")
    .then(response => {
        return loadSiteMap(response);
    })
    .then(routes => {
        let def = false;

        for(const i in routes) {
            if (!def && !routes[i].parent) def = { path : base + "/" , name : 'home', redirect : base + "/data/" + i};
        }

        if (def) {
            router.addRoute(def);
        }
    })
    .then(() => {
        let routes = getRoutesByProfile(_profile);
        items.value.push({
            label : 'Logout',
            command() {
                logout();
            }
        })
    })
}


function loadDictionary() {
    client.get("/user/dictionary")
    .then(response => {
        for(let i in response) {
            i18n.setLocaleMessage(i, response[i]);
        }
    });
}

function loadUser() {
    client.get("/user/details")
    .then(response => {
        name.value = (response.name) ? response.name : response.email;
    });  
}




await client.get("/user/check-user")
.then(response => {
    if (response.name != _profile) {
        require_login.value = true;
        return loadDictionary();
    } else {
        let promises = [];
        promises.push(loadUser());
        promises.push(loadDictionary());
        promises.push(loadRoutes());
        return Promise.all(promises);
    }    
});


</script>