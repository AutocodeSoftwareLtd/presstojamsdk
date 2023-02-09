<template>
	 <div class="row"  style="row-gap:32px">
		<div v-for="irow in repo.data.value" class="col-md-6 col-lg-4">
			<Card>
				<template #content> 
					<div v-for="cell in cells" class="row">
						<div class="col-6">
        					{{ $t("models." + cell.model + ".fields." + cell.name + ".label") }}
    					</div>
    					<div class="col-6">
							<view-field :field="cell" :row="irow" />
						</div>
					</div>
				</template>
				<template #footer>
					<ptj-primary-action v-if="has_primary" :model="store.name" :id="irow['--id']" />
					<component v-for="component in store.actions" 
						:is="component.component"
						:data="props.repo" v-bind="component.atts" 
						:short="true"/>
				</template>
			</Card>
		</div>
	</div>
</template>
<script setup>
import ViewField from "../view/view-field.vue"
import PtjPrimaryAction from "../actions/primary-action.vue"
import Card from 'primevue/card';

const props = defineProps({
    repo : Object
});


const store = props.repo.store;

store.setTableCells();
const cells = store.getEnabledCells();

const children = (store.fields['--id']) ? store.fields['--id'].reference : [];
const has_primary = (children.length) ? true : false;

</script>