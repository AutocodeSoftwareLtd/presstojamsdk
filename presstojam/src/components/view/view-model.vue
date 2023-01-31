<template>
    <div v-for="cell in cells">
	    <view-field :field="cell" :row="repo.data" />
	</div>
</template>
<script setup>
import ViewField from "../view/view-field.vue"

const props = defineProps({
    repo : Object
});


const cells = props.repo.store.getEnabledCells();

</script>