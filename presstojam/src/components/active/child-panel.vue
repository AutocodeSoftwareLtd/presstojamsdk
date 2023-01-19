<template>
	<Panel :header="$t('models.' + model + '.title', 2)" class="gc-child" :class="model">
        <ptj-tree v-if="component == 'recursive'" :name="props.model" @onMove="reload" />
        <ptj-table-display v-else-if="component == 'table'" :name="props.model" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { computed } from "vue"
import { getStore } from "../../js/data/storemanager.js"
import PtjTableDisplay from "./../table/table-display.vue"
import PtjTree from "./../tree/tree.vue"

const props = defineProps({
    model : String
});


const repo = getStore(props.model);
const store =repo.store;
repo.load();

const component = computed(() => {
    if (!store) return "";
    else if (store.fields["--recursive"]) return "recursive";
    else if (store.singleton) return "form";
    else return "table";
});

function reload() {
    store.value.reload();
}
</script>


