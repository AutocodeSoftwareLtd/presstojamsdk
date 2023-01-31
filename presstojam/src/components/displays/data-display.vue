<template>
<DataView :value="repo.data.value" :layout="layout">
	<template #header>
		<DataViewLayoutOptions v-model="layout"></DataViewLayoutOptions>
	</template>
    <template #list="slotProps" >
	 <div class="col-12">
		<div v-for="cell in cells">
			<view-field :field="cell" :row="slotProps.data" />
		</div>
	</div>
	</template>
	<template #grid="slotProps">
	  <div>
		<div class="card" v-for="cell in cells">
			<view-field :field="cell" :row="slotProps.data" />
		</div>
	  </div>
	</template>
</DataView>
</template>
<script setup>
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import ViewField from "../view/view-field.vue"
import { ref } from "vue"

const props = defineProps({
    repo : Object
});


const store = props.repo.store;

store.setTableCells();
const cells = store.getEnabledCells();

const layout = ref('grid');


</script>