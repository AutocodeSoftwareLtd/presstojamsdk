<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="store.title" class="gc-repo" :class="model">
        <component :is="component" :repo="repo" :name="model"/>
    </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import { computed } from "vue"
import { getStore } from "../../js/data/storemanager.js"
import PtjTree from "../tree/tree.vue"
import PtjTableDisplay from '../table/table-display.vue'
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import PtjTreeView from "../displays/data-display.vue"
import PtjView from "../displays/data-display.vue"

/*

*/
const props = defineProps({
    model : String,
    base : String
});


const repo = getStore(props.model);
const store =repo.store;

repo.load();

let is_recursive = false;
for(let i in store.fields) {
    if (store.fields[i].recursive) is_recursive = true;
}


const component = computed(() => {
    if (store.perms.includes("post") || store.perms.includes("put")) {
        return (is_recursive) ? PtjTree : PtjTableDisplay;
    } else {
        return (is_recursive) ?PtjTreeView : PtjView;
    }
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