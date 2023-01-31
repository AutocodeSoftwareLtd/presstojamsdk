<template>
  <div>
    <ptj-slug-trail :name="model" :store="single"/>
    <Panel :header="label">
        <template #icons>
            <audit-action v-if="store.audit" :model="store" :data="data" :long="true" />
            <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
        </template>
        <edit-effect v-if="single.data.value['--id']" :id="single.data.value['--id']" :name="props.model" />
    </Panel>
  </div>
</template>

<script setup>
import { computed, ref, inject, onBeforeUnmount } from "vue"
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


const single = new SingleData(props.model);
const store = single.model;

single.load()
.then(() => {
    console.log("Value is", single.data);
})
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ';// + single.label.value;
});


subscribe("effect_edited", props.model, response => {
    console.log(response, arguments);
});


onBeforeUnmount(() => {
    unsubscribe("effect_edited", props.model);
})

</script>