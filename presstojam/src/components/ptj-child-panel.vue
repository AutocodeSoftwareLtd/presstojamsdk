<template>
	<Panel :header="$t('models.' + model + '.title', 2)">
		<ptj-form v-if="component == 'form'" :model="model" :store="store" />
        <ptj-tree v-else-if="component == 'recursive'" :model="model" :store="store" />
        <ptj-table-display v-else-if="component == 'table'" :model="model" :store="store"  />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { getStoreById } from "./../js/datastore.js"
import { computed } from "vue"
import PtjForm from "./ptj-form.vue"
import PtjTableDisplay from "./ptj-table-display.vue"
import PtjTree from "./ptj-tree.vue"


const props = defineProps({
    model : String
});


const store = computed(() => {
    return getStoreById(props.model);
});


const component = computed(() => {;
    if (!store.value.route) return "";
    else if (store.value.route.schema["--recursive-id"]) return "recursive";
    else if (store.value.route.singleton) return "form";
    else return "table";
});



</script>


