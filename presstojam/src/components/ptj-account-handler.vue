<template>
 <div class="ptj-account-handler">
    <form @submit.prevent="submit" v-show="store.state=='login'" class="ptj-login">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <ptj-form-row v-for="field in store.login_data.cells" :key="field.meta.name" :field="field">
          <ptj-string type="edit" :field="field" />
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-login')" class="ptj-form-submit">
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='create'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <ptj-form-row v-for="field in store.register_data.cells" :key="field.meta.name" :field="field">
          <ptj-number v-if="field.meta.type=='number'" type="edit" :field="field"/>
          <ptj-flag v-else-if="field.meta.type=='flag'" type="edit" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" type="edit" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" type="edit" :field="field" />
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-create')" class="ptj-form-submit">
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

const props = defineProps({
    actions : []
});


const store = reactive({
    state : 'login',
    active : true,
    login_data : new DataRow(),
    register_data : new DataRow(),
    globalerror : ''
});

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
    store.login_data.applyMetaRow(meta)
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
        })
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


