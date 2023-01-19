<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="label">
    
   <TabView>
        <TabPanel :header="getLabel(store.fields, data)">
		    <display :name="props.model" />
	    </TabPanel>
        <TabPanel v-for="child in store.fields['--id'].reference" :header="$t('models.' + child + '.title', 2)">
            <PtjChildPanel :model="child" />
        </TabPanel>
   </TabView>
   </Panel>
</template>

<script setup>
import { computed, onMounted, inject, ref } from "vue"
import { getStore } from "../../js/data/storemanager.js"
import { getLabel } from "../../js/helperfunctions.js"
import Display from "../display.vue"
import PtjChildPanel from  "./child-panel.vue"
import PtjSlugTrail from "./../slugtrail/slug-trail.vue"
import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"
import Panel from "primevue/panel"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    model : String,
    base : String
});


const repo = getStore(props.model);
const store =repo.store;

const data = ref({});
repo.load()
.then(response => {
    data.value = response;
})
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + getLabel(store.fields, data.value);
});

if (store.route && store.active && store.active.mounted) {
    onMounted(() => {
        store.active.mounted(store);
    })
}

</script>