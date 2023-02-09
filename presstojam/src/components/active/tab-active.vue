<template>
   <TabView lazy>
        <TabPanel :header="getLabel(store.fields, data)">
		    <Panel :header="$t('models.' +store.name + '.title')">
            <template #icons>
                <audit-action v-if="store.audit" :model="store" :data="data" :long="true" />
                <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
            </template>
                <edit-effect v-if="data['--id']" :id="data['--id']" :name="store.name" />
            </Panel>
	    </TabPanel>
        <TabPanel v-for="child in store.fields['--id'].reference" :header="$t('models.' + child + '.title', 2)">
            <PtjChildPanel :model="child" :id="active.active_id"/>
        </TabPanel>
   </TabView>
</template>
<script setup>
import { computed, onMounted, onBeforeUnmount, inject, ref } from "vue"
import { getLabel } from "../../js/helperfunctions.js"
import PtjChildPanel from  "./child-panel.vue"
import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"
import Panel from "primevue/panel"
import EditEffect from "../effects/edit-effect.vue"
import AuditAction from "../actions/audit-action.vue"
import { subscribe, unsubscribe } from "../../js/bus/bus.js"

const i18n = inject("i18n");
const t = i18n.t;


const props = defineProps({
    active : Object
});

const store = props.active.store;

const data = ref({});
props.active.load()
.then(response => {
    data.value = response;
})
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + store.name + '.title') + ': ' + getLabel(store.fields, data.value);
});

subscribe("form_saved", props.active.active_id, (response, method, model) => {
    if (model.name == store.name) {
        props.active.reload()
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

onBeforeUnmount(() => {
    unsubscribe("form_saved", props.active.active_id);
});

</script>