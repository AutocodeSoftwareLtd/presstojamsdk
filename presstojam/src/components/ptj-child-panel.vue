<template>
	<Panel :header="$t('models.' + model + '.title', 2)">
        <ptj-tree v-if="component == 'recursive'" :name="props.model" @onMove="reload" />
        <ptj-table-display v-else-if="component == 'table'" :name="props.model" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { getStoreById } from "./../js/datastore.js"
import { computed } from "vue"

import PtjTableDisplay from "./ptj-table-display.vue"
import PtjTree from "./ptj-tree.vue"
import { createRepoStore, regStore } from "./../js/reactivestores.js"


const props = defineProps({
    model : String
});

const store = getStoreById(props.model);

const repo = createRepoStore(store);
regStore(props.model, repo);
repo.load();

const component = computed(() => {
    if (!store) return "";
    else if (!store.route) return "";
    else if (store.route.schema["--recursive"]) return "recursive";
    else if (store.route.singleton) return "form";
    else return "table";
});


function reload() {
    store.value.reload();
}
</script>


