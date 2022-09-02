<template>
	<Panel :header="store.route.title">
		<ptj-form v-if="component == 'form'" />
        <ptj-tree-table v-else-if="component == 'recursive'" />
        <ptj-table v-else-if="component == 'table'" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel';
import { getData } from "./../js/datastore.js"
import { provide, ref } from "vue"
import PtjForm from "./ptj-form.vue"
import PtjTable from "./ptj-table.vue"
import PtjTreeTable from "./ptj-tree-table.vue"


const props = defineProps({
    model : String,
    parent : Number
});


const data_store =getData(props.model);
const store = data_store.store;
provide("model", props.model);

let component = ref();

data_store.load()
.then(() => {
    if (store.route.schema["--recursive-id"]) component.value = "recursive";
    else if (store.route.singleton) component.value = "form";
    else component.value = "table";
});


</script>


