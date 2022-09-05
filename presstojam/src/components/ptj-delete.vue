<template>
    <p>Are you sure you want to delete:</p>
    <ul>
        <li v-for="item in data">{{ item.label }}</li>
    </ul>
    <p>Type <i>{{ check_str }}</i> in the box below</p>
    <div class="p-inputgroup">
        <InputText :placeholder="check_str" v-model="delval"/>
        <Button label="Delete" :disabled="disabled" icon="pi pi-trash" @click="del" class="p-button-danger">Delete</Button>
    </div>
</template>

<script setup>

import client from "./../js/client.js"
import { ref, computed } from "vue";
import Button from "primevue/Button"
import InputText from 'primevue/inputtext';


const props = defineProps({
    check_str : {
        type : String,
        default : "delete"
    },
    data : [Array, Object],
    model : String
});

const emits = defineEmits(['deleted']);

let delval = ref("");

const disabled = computed(() => {
    return (delval.value == props.check_str) ? false : true;
})


function del() {
    let params = {};
    if (props.data.length > 1) {
        const keys = [];
        for(const row of props.data) {
            keys.push(row.key);
        }
        params["--id"] = keys;
    } else {
        params["--id"] = props.data[0].key;
    }


    client.delete("/data/" + props.model, params)
    .then(res => {
        emits("deleted");
    })
    .catch(e => console.log(e));
}
    
</script>
