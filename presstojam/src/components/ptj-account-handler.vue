<template>
 <div class="ptj-account-handler">
    <form @submit.prevent="submit" v-show="state=='login'" class="ptj-login">
        <div class="ptj-form-error" v-show="globalerror">{{ globalerror }}</div>
        <ptj-form-row v-for="field in data.cells" :key="field.meta.name" :field="field">
          <ptj-string type="edit" :field="field" />
        </ptj-form-row>
        <input type="submit" value="Submit" class="ptj-form-submit">
    </form>
    <form  @submit.prevent="submit" v-show="state=='create'" class="ptj-register">
        <div class="ptj-form-error" v-show="globalerror">{{ globalerror }}</div>
        <ptj-form-row v-for="field in data.cells" :key="field.meta.name" :field="field">
          <ptj-number v-if="field.meta.type=='number'" type="edit" :field="field"/>
          <ptj-flag v-else-if="field.meta.type=='flag'" type="edit" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" type="edit" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" type="edit" :field="field" />
        </ptj-form-row>
        <input type="submit" value="Submit" class="ptj-form-submit">
    </form>
    <ptj-nav :action="actions" />
 </div>
</template>

<script setup>

import PtjFormRow from "./ptj-form-row.vue"
import PtjString from "./ptj-string.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjTime from "./ptj-time.vue"
import PtjNav from "./ptj-nav.vue"

import { ref } from 'vue'
import { DataRow } from '../js/datarow.js';

const props = defineProps({
    metarow : Object,
    map : Object,
    actions : []
});

const state = ref('login');
const active = ref('true');

//load our modules

const globalerror = ref('');
const data = new DataRow(props.metarow);


function submit() {
    active.value = false;
    let data = data.serialize("login");
    const url = props.map.model;
    if (state == "login") url += "-login";
    return client.post(url, data)
    .then(request=>{
        if (request.__status!= "SUCCESS") {
            globalerror.value = request.statusText;
            active.value = true;
        }
        return request;
    })
    .then(() => {
        $emit('reload');
    })
    .catch(e => {
        console.log(e);
    });

} 
</script>


