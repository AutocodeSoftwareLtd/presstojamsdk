<template>
  <div :class="model" class="gc-detail">
    <ptj-slug-trail :name="model" :store="active"/>
    <Panel :header="label">
    
    
   <TabView lazy>
        <TabPanel :header="getLabel(store.fields, data)">
		    <Panel :header="$t('models.' +store.name + '.title')">
            <template #icons>
                <audit-action v-if="store.audit" :model="store" :data="data" :long="true" />
                <ptj-delete-action v-if="store.perms.includes('delete')" :name="store.name" :data="data"/>
                <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
            </template>
            <div v-if="store.perms.includes('put')">
                <edit-effect v-if="data['--id']" :id="data['--id']" :name="props.model" />
            </div>
            <div v-else>
                <view-model :repo="active" />
            </div>
            </Panel>
	    </TabPanel>
        <TabPanel v-for="child in store.fields['--id'].reference" :header="$t('models.' + child + '.title', 2)">
            <PtjChildPanel :model="child" />
        </TabPanel>
   </TabView>
   </Panel>
  </div>
</template>
<script setup>
import { computed, onMounted, inject, ref } from "vue"
import { ActiveData } from "../../js/data/activedata.js"
import { getLabel } from "../../js/helperfunctions.js"
import PtjChildPanel from  "./child-panel.vue"
import PtjSlugTrail from "./../slugtrail/slug-trail.vue"
import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"
import Panel from "primevue/panel"
import EditEffect from "../effects/edit-effect.vue"
import AuditAction from "../actions/audit-action.vue"
import PtjDeleteAction from "../actions/delete-action.vue"
import { subscribe, unsubscribe } from "../../js/bus/bus.js"
import ViewModel from "./../view/view-model.vue"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    model : String,
    id : Number
});


const active = new ActiveData(props.model, props.id);
const store = active.store;

const data = ref({});
active.load()
.then(response => {
    data.value = response;
})
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + getLabel(store.fields, data.value);
});

subscribe("form_saved", active.active_id, (response, method, model) => {
    if (model.name == props.model.name) {
        active.reload()
        .then(response => {
            data.value = response;
        })
        .catch(e => console.log(e));
    }
});

if (store.route && store.active && store.active.mounted) {
    onMounted(() => {
        store.active.mounted(store);
    })
}

</script>