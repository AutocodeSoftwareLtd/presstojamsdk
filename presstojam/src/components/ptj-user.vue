<template>
    <Teleport :to="teleport">
        <div class="ptj-users">
        <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">{{ name }}</Button>
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
        </div>
    </Teleport>
</template>
<script setup>
import Menu from 'primevue/menu';
import { ref, inject } from 'vue';
import { getRoutesByProfile } from "./../js/routes.js"
import { getSetting } from "./../js/settings.js"
import Button from "primevue/Button"


const menu = ref();
const name = ref("");
const items = ref([]);
const teleport = getSetting("user.teleport", "body");

const client = inject("client");
const profile = inject("profile");

const toggle = (event) => {
    menu.value.toggle(event);
};

function logout()  {
    return client.post("/user/logout", {'x-force-auth-cookies' : 1})
    .then(() => {
        location.href = getSetting("map.base");
    });
}

client.get("/user/details")
.then(response => {
    name.value = (response.name) ? response.name : response.email;
    let routes = getRoutesByProfile(profile);

    items.value.push({
        label : 'Logout',
        command() {
            logout();
        }
    })
})  
</script>