<template>
    <div class="ptj-slug-trail">
        <ptj-button v-for="trail in trails" :key="trail.id" :route="trail.route">{{ trail.value }}</ptj-button>
    </div>
</template>
<script setup>
import PtjButton from "./ptj-button.vue"
import { ref, onMounted } from "vue"
import client from "./../js/client.js"
import { Map } from "./../js/route.js"

const trails = ref([]);

const init = async() => {
    trails.value.splice(0);
    return client.get("/slug/" + Map.route + "/" + Map.model + "/" + Map.key)
    .then(response => {
        for(let i in response) {
            let values = [];
            for(let x in response[[i]]) {
                if (x == "--id") {
                    continue;
                }
                values.push(response[i][x]);
            }
            trails.value.push({
                id : response[i]["--parentid"],
                model : response[i].model
            });
        }
    });
}

onMounted(async () => {
   // await init();
});

</script>