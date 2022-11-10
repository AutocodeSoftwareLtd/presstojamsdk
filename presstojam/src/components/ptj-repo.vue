<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="store.route.title">

        <PtjTree v-if="recursive" :name="model" />
        <PtjTableDisplay v-else :name="model"  />

    </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import { computed, onMounted } from "vue"
import { getStoreById } from "./../js/datastore.js"
import { createRepoStore, regStore } from "./../js/reactivestores.js"
import PtjTree from "./ptj-tree.vue"
import PtjTableDisplay from './ptj-table-display.vue'
import PtjSlugTrail from "./ptj-slug-trail.vue"

/*

*/
const props = defineProps({
    model : String,
    base : String
});



const store = getStoreById(props.model);
const repo = createRepoStore(store);
regStore(props.model, repo);
repo.load();


const recursive = computed(() => {
    for(let i in store.route.schema) {
        if (store.route.schema[i].recursive) return true;
    }
    return false;
})

if (store.route && store.route.settings.repo && store.route.settings.repo.mounted) {
    onMounted(() => {
        store.route.settings.repo.mounted(store);
    })
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table, thead, tbody, tr {
    width : 100%;
}


.ptj-table-wrapper {
    position : relative;
}

</style>