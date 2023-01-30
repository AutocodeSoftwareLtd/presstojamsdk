<template>
  <div class="gc-master" :class="model">
    <ptj-slug-trail :name="model" :store="repo"/>
    <Panel :header="store.title" class="gc-repo" :class="model">
        <component :is="component" :repo="repo" :name="model"/>
    </Panel>
  </div>
</template>

<script setup>
import Panel from 'primevue/panel'
import { computed } from "vue"
import { RepoData } from "../../js/data/repodata.js"
import PtjTree from "../tree/tree.vue"
import PtjTableDisplay from '../table/table-display.vue'
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import PtjTreeView from "../displays/data-display.vue"
import PtjView from "../displays/data-display.vue"

/*

*/
const props = defineProps({
    model : String,
    id : Number
});


const repo = new RepoData(props.model);
repo.parent_id = props.id;
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