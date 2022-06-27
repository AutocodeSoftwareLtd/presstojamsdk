<template>
 <div class="ptj-account-handler">
    <form @submit.prevent="submit" v-show="store.state=='login'" class="ptj-login">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <ptj-form-row v-for="field in store.login_data.cells" :key="field.meta.name" :field="field">
          <ptj-string type="post" :field="field" />
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-login')" class="ptj-form-submit">
        <a v-if="RouteStore.route.perms.includes('post')" @click="toggleState('create')">Register</a>
        <a @click="toggleState('forgotpassword')">Forgotten password?</a>
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='create'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <ptj-form-row v-for="field in store.register_data.cells" :key="field.meta.name" :field="field">
          <ptj-number v-if="field.meta.type=='number'" type="post" :field="field"/>
          <ptj-flag v-else-if="field.meta.type=='flag'" type="post" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" type="post" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" type="post" :field="field" />
          <ptj-form-row :field="field" v-if="field.encrypted">
            <ptj-confirm :field="field" />
          </ptj-form-row>
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-create')" class="ptj-form-submit">
        <a v-if="RouteStore.route.perms.includes('login')" @click="toggleState('login')">Login</a>
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='forgotpassword'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <ptj-form-row v-for="field in store.forgot_password.cells" :key="field.meta.name" :field="field">
          <ptj-string type="post" :field="field" />
          <ptj-form-row :field="field">
            <ptj-confirm :field="field" />
          </ptj-form-row>
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-forgot-password')" class="ptj-form-submit">
        <a @click="toggleState('login')">Login</a>
    </form>
 </div>
</template>

<script setup>

import PtjFormRow from "./ptj-form-row.vue"
import PtjString from "./ptj-string.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjTime from "./ptj-time.vue"
import { refresh } from "./../js/route.js"
import { Map } from "./../js/map.js"
import { reactive } from 'vue'
import { DataRow } from './../js/datarow.js';
import { MetaRow } from "./../js/metarow.js"
import client from "./../js/client.js"
import { getDictionary } from "./../js/dictionary.js"
import {RouteStore } from "./../js/route.js"
import PtjConfirm from "./ptj-form-confirm.vue"

const props = defineProps({
    actions : []
});


const store = reactive({
    state : 'login',
    active : true,
    login_data : new DataRow(),
    register_data : new DataRow(),
    forgot_password : new DataRow(),
    globalerror : ''
});

function toggleState(state) {
    store.state = state;
}

//load our modules

client.post("/route/" + Map.route + "/" + Map.model)
.then(response => {
    let meta = new MetaRow();
    meta.map(response.fields);
    store.register_data.applyMetaRow(meta);
});

client.post("/route/" +  Map.route + "/" + Map.model + "/login")
.then(response => {
    let meta = new MetaRow();
    meta.map(response.fields);
    store.login_data.applyMetaRow(meta);

    store.forgot_password.applyMetaRow(meta);
});


function submit() {
    store.active = false;
    store.globalerror = "";
    if (store.state == "login") {
        return client.post("/data/" +  Map.route + "/" + Map.model + "/login", store.login_data.serialize("login"))
        .then(response => {
            refresh();
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else if (store.state == "forgotpassword") {
        return client.post("/data/" +  Map.route + "/" + Map.model + "/forgotpassword", store.forgot_password.serialize("login"))
        .then(response => {
            refresh();
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else {
        return client.post("/data/" + Map.route + "/" +  Map.model, store.register_data.serialize("post"))
        .then(response => {
            refresh();
        })
        .catch(e => {
            store.register_data.applyErrors(e);
        });
    }
} 
</script>


