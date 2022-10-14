<template>
    <ptj-slug-trail :name="model" :base="base" />
    <Panel :header="label">
    
   <TabView>
        <TabPanel :header="repo.label.value">
		    <ptj-display :name="props.model" />
	    </TabPanel>
        <TabPanel v-for="child in store.route.schema['--id'].reference" :header="$t('models.' + child + '.title', 2)">
            <PtjChildPanel :model="child" />
        </TabPanel>
   </TabView>
   </Panel>
</template>

<script setup>
import { computed, onMounted } from "vue"
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import PtjChildPanel from "./ptj-child-panel.vue"
import PtjDisplay from "./ptj-display.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { getStoreById } from "./../js/datastore.js"
import Panel from 'primevue/panel';
import { useI18n } from 'vue-i18n';

import { createActiveStore, regStore } from "./../js/reactivestores.js"
const { t } = useI18n();

/*
<TabPanel v-for="child in store.route.children" :header="child">
            <PtjChildPanel :parent="store.active['--id']" :model="child" />
        </TabPanel>
*/
const props = defineProps({
    model : String,
    base : String
});


const store = getStoreById(props.model);

const repo = createActiveStore(store);
regStore(props.model, repo);
repo.load()
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + repo.label.value;
})

if (store.route && store.route.settings.active && store.route.settings.active.mounted) {
    onMounted(() => {
        store.route.settings.active.mounted(store);
    })
}

</script>