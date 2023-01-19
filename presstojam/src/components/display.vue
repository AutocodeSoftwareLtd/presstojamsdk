<template>
    <Panel :header="$t('models.' + store.name + '.title')">
        <template #icons>
            <ptj-show-audit v-if="store.audit" :model="store" :data="data" />
            <ptj-delete-action :name="name" :single="true" />
            <component v-for="component in store.actions" :is="component.component" :data="data" v-bind="component.atts"/>
        </template>
        <ptj-form v-if="data['--id']" :model="store" :data="data" method="put" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel'
import { getStore } from "../js/data/storemanager.js"
import PtjForm from "./form/form.vue"
import PtjDeleteAction from "./actions/delete-action.vue"
import PtjShowAudit from "./actions/show-audit.vue"
import { getLabel } from "../js/helperfunctions.js"
import { ref } from "vue"


const props = defineProps({
    name : {
      type : String,
      required : true
    }
});


const repo = getStore(props.name);
const store = repo.store;


const data = ref({});
repo.load()
.then(response => {
    data.value = response;
    repo.selected.value = [{ key : data.value['--id'], label : getLabel(store.fields, data.value) }];
});




</script>