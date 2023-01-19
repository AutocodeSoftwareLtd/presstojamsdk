<template>
	<Panel :header="$t('models.' + model + '.title', 2)" class="gc-child" :class="model">
        <ptj-tree v-if="component == 'recursive'" :name="props.model" @onMove="reload" />
        <ptj-table-display v-else-if="component == 'table'" :name="props.model" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { getModel } from "../../js/models/modelstore.js"
import { computed } from "vue"
import { createRepoStore, regStore } from "../../js/reactivestores.js"
import PtjTableDisplay from "./../table/table-display.vue"
import PtjTree from "./../tree/tree.vue"

const props = defineProps({
    model : String
});

const store = getModel(props.model);

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


