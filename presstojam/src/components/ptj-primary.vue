<template>
    <ptj-slug-trail />
   <TabView>
        <TabPanel header="Details">
		    <ptj-form />
	    </TabPanel>
        <TabPanel v-for="child in store.route.children" :header="child">
            <PtjChildPanel :parent="props.id" :model="child" />
        </TabPanel>
   </TabView>
 
</template>

<script setup>
import { provide, computed} from "vue"
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import PtjChildPanel from "./ptj-child-panel.vue"
import PtjForm from "./ptj-form.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { getDataStoreById } from "./../js/datastore.js"


/*
<TabPanel v-for="child in store.route.children" :header="child">
            <PtjChildPanel :parent="store.active['--id']" :model="child" />
        </TabPanel>
*/
const props = defineProps({
    model : String,
    id : Number
});

provide("model", props.model);

const data = getDataStoreById(props.model);
const store = data.store;

</script>