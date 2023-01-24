<template>
<DataView :value="data">
    <template #list="slotProps" >
		<div>Vin: <b>{{slotProps.data.vin}}</b></div>
	</template>
	<template #grid="slotProps">
		<div>Vin: <b>{{slotProps.data.vin}}</b></div>
	</template>
</DataView>
</template>
<script setup>
import DataView from 'primevue/dataview';
import { ref } from "vue"

const props = defineProps({
    model : String,
    parent_id : Number
});

const data = ref([]);

</script>