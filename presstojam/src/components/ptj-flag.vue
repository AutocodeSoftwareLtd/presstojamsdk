<template>
    <input class="ptj-checkbox" type="checkbox" :true-value="1" :false-value="0" :name="field.name" v-model="field.change" v-if="field.mode=='edit' || field.mode == 'post'">
    <select v-else-if="field.mode=='filter'" :name="field.name" v-model="field.change1" class="ptj-filter-form-checkbox">
        <option :value='0'>{{ "All" }}</option>
        <option :value='1'>{{ "Checked" }}</option>
        <option :value='2'>{{ "Unchecked" }}</option>
    </select>
    <a v-else @click="submit()"><span class="material-icons">{{ icon }}</span></a>
</template>

<script setup>
import { computed } from "vue"
import { Map } from "./../js/map.js"
import client from "./../js/client.js"

const props = defineProps({
    field : Object,
    id : Number
});


function submit() {
    let params = {};
    params["--id"] = props.id;
    params[props.field.name] = (props.field.val == 1) ? 0 : 1;
    return client.put("/data/" +  Map.model, params)
    .then(() => {
        props.field.val = (props.field.val == 1) ? 0 : 1;
    })
    .catch(e => {
        console.log(e);
    });
}

let icon = computed(() => {
    if (props.field.val == 1) {
        return "check_circle_outline";
    } else {
        return "highlight_off"
    }
});
</script>