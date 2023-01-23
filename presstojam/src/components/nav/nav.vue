<template>
    <Menubar :model="items">
        <template #item="{item}">
            <router-link v-if="item.is_report == false" :to="{ name : 'repo', params : { 'model' : item.model }}" v-slot="{href, route, navigate, isActive, isExactActive}">
                <a :href="href" @click="navigate" class="p-menuitem-link p-menuitem-content" :class="{'active-link': isActive, 'active-link-exact': isExactActive}">{{item.label}}</a>
            </router-link>
            <div v-else>
                <a class="p-menuitem-link p-menuitem-content" @click="toggleReports">Reports</a>
                <Menu id="report_menu" ref="report_menu" :model="report_items" :popup="true">
                    <template #item="{item}">
                        <router-link :to="{ name : 'report', params : { 'model' : item.model }}" v-slot="{href, route, navigate, isActive, isExactActive}">
                            <a :href="href" @click="navigate" class="p-menuitem-link p-menuitem-content" :class="{'active-link': isActive, 'active-link-exact': isExactActive}">{{item.label}}</a>
                        </router-link>
                    </template>
                </Menu>
            </div>
            
        </template>
        <template #end>
            <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">{{ name }}</Button>
            <Menu id="overlay_menu" ref="menu" :model="account_items" :popup="true">
                <template #item="{item}">
                    <router-link v-if="item.model" :to="{ name : 'single', params : { 'model' : item.model }}" v-slot="{href, route, navigate, isActive, isExactActive}">
                        <a @click="navigate" class="p-menuitem-link p-menuitem-content" :class="{'active-link': isActive, 'active-link-exact': isExactActive}">{{item.label}}</a>
                    </router-link>
                    <div v-else>
                        <a @click="item.command" class="p-menuitem-link p-menuitem-content">{{item.label}}</a>
                    </div>
                </template>
            </Menu>
        </template>
    </Menubar>
</template>
<script setup>
import Menubar from 'primevue/menubar';
import { ref, inject } from "vue"
import Menu from 'primevue/menu';
import Button from "primevue/button"
import configs from "./../../js/configs.js"
import { getEntities } from "./../../js/entity/entitymanager.js"

const props = defineProps({
    name : [String, Object]
});

const _profile = configs.get("profile");
const client = inject("client");

const items = ref([]);
const account_items = ref([]);
const report_items = ref([]);
const menu = ref();
const report_menu = ref();

let routes = getEntities();

let arr = [];
let carr = [];

for(const i in routes) {
    const route = routes[i];
    if (!route.parent) {
        if (route.min_rows == 1 && route.max_rows == 1 && route.cells['--owner'] && route.cells['--owner'].reference == _profile) {
            carr.push({
                label : route.name,
                model : i,
                is_report : false
            });
            
            for(const x of route.cells['--id'].reference) {
                const croute = routes[x];
                arr.push({
                    label : croute.name,
                    model : x,
                    is_report : false
                });
            }
        } else {
            arr.push({
                label : route.name,
                model : i,
                is_report : false
            });
        }

        report_items.value.push({
            label : route.name,
            model : i
        });
    }
    
}

arr.push({
    'label' : 'Reports',
    reports : report_items,
    is_report : true
});

items.value = arr;

carr.push({
    label : 'Logout',
    command() {
        logout();
    }
});

account_items.value = carr;
/*
        items.value.push({
            label : 'Logout',
            command() {
                logout();
            }
        })
*/

function logout()  {
    return client.post("/user/logout", {'x-force-auth-cookies' : 1})
    .then(() => {
        location.href = configs.get("base") + "/";
    });
}

const toggle = (event) => {
    menu.value.toggle(event);
};


const toggleReports = (event) => {
    report_menu.value.toggle(event);
};
</script>