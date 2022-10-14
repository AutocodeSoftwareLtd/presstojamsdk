<template>
    <Panel :header="$t('models.' + store.model + '.title')">
        <template #icons>
            <ptj-show-audit v-if="store.route.audit" :id="repo.data['--id']" :store="store" />
            <ptj-delete-action :name="name" :single="true" />
        </template>
        <ptj-form :schema="store.route.schema" :model="store.model" :data="repo.data.value" method="put" />
    </Panel>
</template>
<script setup>
import PtjForm from "./ptj-form.vue"
import Panel from 'primevue/panel'
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import PtjShowAudit from "./actions/ptj-show-audit.vue"
import { getStore } from "./../js/reactivestores.js"



const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const repo = getStore(props.name);
const store = repo.store;
repo.selected.value = [{ key : repo.data.value['--id'], label : repo.label }];


</script>