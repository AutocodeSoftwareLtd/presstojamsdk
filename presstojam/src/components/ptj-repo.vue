<template>
    <ptj-slug-trail :model="model" :id="parentid" :store="store" :base="base" />
    <Panel :header="store.route.title">

        <PtjTree v-if="recursive" :model="model" :store="store" />
        <PtjTableDisplay v-else :model="model" :store="store" />

    </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import PtjTableDisplay from "./ptj-table-display.vue"
import PtjTree from "./ptj-tree.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { computed, onMounted } from "vue"
import { getStoreById } from "./../js/datastore.js"


/*

*/
const props = defineProps({
    model : String,
    parentid : Number,
    base : String
});


const store = computed(() => {
    return getStoreById(props.model);
});


const recursive = computed(() => {
    for(let i in store.value.route.schema) {
        if (store.value.route.schema[i].recursive) return true;
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