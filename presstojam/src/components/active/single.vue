<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="label">
        <display :name="props.model" />
   </Panel>
</template>

<script setup>
import { computed, onMounted, inject } from "vue"
import { getStoreById } from "../../js/datastore.js"
import { createFirstStore, regStore } from "../../js/reactivestores.js"
import Display from "../display.vue"
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import Panel from "primevue/panel"

const i18n = inject("i18n");
const t = i18n.t;



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

const repo = createFirstStore(store);
regStore(props.model, repo);
repo.load()
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + repo.label.value;
});

if (store.route && store.route.settings.active && store.route.settings.active.mounted) {
    onMounted(() => {
        store.route.settings.active.mounted(store);
    })
}

</script>