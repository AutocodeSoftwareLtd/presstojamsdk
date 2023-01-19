<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="store.title" class="gc-repo" :class="model">

        <PtjTree v-if="recursive" :name="model" />
        <PtjTableDisplay v-else :name="model"  />

    </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import { computed } from "vue"
import { getStore } from "../../js/data/storemanager.js"
import PtjTree from "../tree/tree.vue"
import PtjTableDisplay from '../table/table-display.vue'
import PtjSlugTrail from "../slugtrail/slug-trail.vue"

/*

*/
const props = defineProps({
    model : String,
    base : String
});


const repo = getStore(props.model);
const store =repo.store;

repo.load();


const recursive = computed(() => {
    for(let i in store.fields) {
        if (store.fields[i].recursive) return true;
    }
    return false;
})

repo.trigger("mounted");

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