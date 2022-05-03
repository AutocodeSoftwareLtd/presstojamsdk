<template>
    <p>Are you sure you want to permanently delete this record? Type {{ check_str }} in the box below to continue.</p>
    <input type="text" :placeholder="check_str" @keyup="checkStatus" v-model="delval">
    <button :disabled="disabled" @click="del">Delete</button>
</template>

<script setup>

import client from "./../js/client.js"
import Events from "./../js/events.js"
import { inject, ref } from "vue";

const props = defineProps({
    check_str : {
        type : String,
        default : "delete"
    }
});

const map = inject("map");
let delval = ref("");
let disabled = ref(true);

function checkStatus() {
    disabled.value = (delval.value == props.check_str) ? false : true;
}

function del() {
    client.delete("/" + map.model, {"__key":map.key})
    .then(res => {
        $emit("back");
    })
    .catch(e => console.log(e));
}
    
</script>
