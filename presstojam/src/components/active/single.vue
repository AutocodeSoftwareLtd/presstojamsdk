<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="label">
        <template #icons>
            <audit-action v-if="store.audit" :model="store" :data="data" :long="true" />
            <ptj-delete-action :name="store.name" :data="data"/>
            <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
        </template>
        <ptj-form v-if="data['--id']" :model="store" :data="data" method="put" />
    </Panel>
</template>

<script setup>
import { computed, ref, inject } from "vue"
import { getModel } from "../../js/models/modelmanager.js"
import { createFirstStore, regStore } from "../../js/data/storemanager.js"
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import Panel from "primevue/panel"
import PtjForm from "../form/form.vue"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    model : String,
    base : String
});


const store = getModel(props.model);

const repo = createFirstStore(store);
const data = ref({});
regStore(props.model, repo);
repo.load()
.then(response => {
    data.value = response;
})
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + repo.label.value;
});

store.trigger("mounted");


</script>