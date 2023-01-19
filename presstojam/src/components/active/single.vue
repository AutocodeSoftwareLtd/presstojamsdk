<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="label">
        <display :name="props.model" />
   </Panel>
</template>

<script setup>
import { computed, onMounted, inject } from "vue"
import { getModel } from "../../js/models/modelmanager.js"
import { createFirstStore, regStore } from "../../js/data/storemanager.js"
import Display from "../display.vue"
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import Panel from "primevue/panel"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    model : String,
    base : String
});


const store = getModel(props.model);

const repo = createFirstStore(store);
regStore(props.model, repo);
repo.load()
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + repo.label.value;
});

store.trigger("mounted");


</script>