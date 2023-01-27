<template>
    <ptj-slug-trail :name="model" />
    <Panel :header="label">
        <template #icons>
            <audit-action v-if="store.audit" :model="store" :data="data" :long="true" />
            <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
        </template>
        <edit-effect v-if="repo.data.value['--id']" :id="repo.data.value['--id']" :name="props.model" />
    </Panel>
</template>

<script setup>
import { computed, ref, inject, onBeforeUnmount } from "vue"
import { getModel } from "../../js/models/modelmanager.js"
import PtjSlugTrail from "../slugtrail/slug-trail.vue"
import Panel from "primevue/panel"
import EditEffect from "../effects/edit-effect.vue"
import AuditAction from "../actions/audit-action.vue"
import { subscribe, unsubscribe } from "../../js/bus/bus.js"
import { SingleData } from "./../../js/data/singledata.js"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    model : String,
    base : String
});


const store = getModel(props.model);

const repo = new SingleData(store);

regStore(props.model, repo);
repo.load()
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ';// + repo.label.value;
});


subscribe("effect_edited", props.model.name, response => {
    console.log(response, arguments);
});


onBeforeUnmount(() => {
    unsubscribe("effect_edited", props.model_name);
})

</script>