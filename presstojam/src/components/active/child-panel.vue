<template>
	<Panel :header="$t('models.' + model + '.title', 2)" class="gc-child" :class="model">
        <component :is="component" :repo="repo" :name="model"/>
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { computed } from "vue"
import { RepoData } from "../../js/data/repodata.js"
import PtjTableDisplay from "./../table/table-display.vue"
import PtjTree from "./../tree/tree.vue"
import PtjTreeView from "../displays/data-display.vue"
import PtjView from "../displays/data-display.vue"

const props = defineProps({
    model : String,
    id : Number
});

console.log("ID is", props.id);

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
});


</script>


