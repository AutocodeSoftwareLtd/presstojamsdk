<template>
    <p>Are you sure you want to permanently delete this record? Type {{ check_str }} in the box below to continue.</p>
    <input type="text" :placeholder="check_str" @keyup="checkStatus" v-model="delval">
    <button :disabled="disabled" @click="del">Delete</button>
</template>

<script setup>

import client from "./../js/client.js"
import { ref } from "vue";
import { redirect } from "./../js/route.js"
import { Map } from "./../js/map.js"

const props = defineProps({
    check_str : {
        type : String,
        default : "delete"
    },
    parentid : {
        default : 0
    }
});

const emits = defineEmits(['close']);

let delval = ref("");
let disabled = ref(true);

function checkStatus() {
    disabled.value = (delval.value == props.check_str) ? false : true;
}

function del() {
    client.delete("/data/" + Map.route + "/" + Map.model, {"--id":Map.key})
    .then(res => {
        Map.state = "parent";
        Map.key = props.parentid.val;
        redirect();
    })
    .catch(e => console.log(e));
}
    
</script>
