<template>
    <ptj-slug-trail :model="model" :id="id" :store="store" :base="base" />
    <Panel :header="props.model + ': ' + label">
    
   <TabView>
        <TabPanel :header="label">
		    <ptj-display :model="model" :store="store" />
	    </TabPanel>
        <TabPanel v-for="child in store.route.children" :header="$t('models.' + child + '.title')">
            <PtjChildPanel :model="child" />
        </TabPanel>
   </TabView>
   </Panel>
</template>

<script setup>
import { computed} from "vue"
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import PtjChildPanel from "./ptj-child-panel.vue"
import PtjDisplay from "./ptj-display.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { getStoreById } from "./../js/datastore.js"
import Panel from 'primevue/panel';
import { getLabel } from "../js/helperfunctions";


/*
<TabPanel v-for="child in store.route.children" :header="child">
            <PtjChildPanel :parent="store.active['--id']" :model="child" />
        </TabPanel>
*/
const props = defineProps({
    model : String,
    id : Number,
    base : String
});


const store = computed(() => {
    return getStoreById(props.model);
});

const label = computed(() => {
    return getLabel(store.value.route.schema, store.value.active.value);
});

</script>