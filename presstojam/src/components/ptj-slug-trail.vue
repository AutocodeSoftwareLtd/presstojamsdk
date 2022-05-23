<template>
    <div class="ptj-slug-trail">
        <ptj-button v-for="trail in trails" :key="trail.id" :route="trail.route">{{ trail.value }}</ptj-button>
    </div>
</template>
<script setup>
import PtjButton from "./ptj-button.vue"
import { ref, inject } from "vue"
import client from "./../js/client.js"

const trails = ref([]);
const map = inject("map");

const init = async() => {
    let params = {};
    if (map.state == "primary") params["--id"] = map.key;
    else params["--parentid"] = map.key;
    return client.get("/data/" + map.route + "/" + map.model + "/slug", params)
    .then(response => {
        trails.value.splice(0);
        for(let i in response) {
            let values = [];
            for(let x in response[[i]]) {
                if (x == "--id") continue;
                values.push(response[i][x]);
            }
            trails.value.push({
                id : response[i]["--id"],
                value : values.join(" "),
                route : {
                    model : response[i].model
                }
            })
        }
    });
}



</script>