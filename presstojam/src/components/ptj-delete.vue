<template>
    <p>{{ title }}</p>
    <input type="text" :placeholder="check_str" @keyup="checkStatus" v-model="delval">
    <button :disabled="disabled" @click="del">{{ btn }}</button>
</template>

<script setup>

import client from "./../js/client.js"
import { ref, computed } from "vue";

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
let title = computed(() => {
    return getDictionary("ptj-delete-title",  { val : props.check_str});
});

let btn = computed(() => {
    return getDictionary("ptj-delete-btn");
});

function checkStatus() {
    disabled.value = (delval.value == props.check_str) ? false : true;
}

function del() {
    client.delete("/data/" + Map.model, {"--id":Map.key})
    .then(res => {
        Map.state = "parent";
        Map.key = props.parentid.val;
        redirect();
    })
    .catch(e => console.log(e));
}
    
</script>
