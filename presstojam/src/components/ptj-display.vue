<template>
    <Panel :header="$t('models.' + store.model + '.title')">
        <template #icons>
            <ptj-show-audit v-if="store.route.audit" :repo="repo" />
            <ptj-delete-action :name="name" :single="true" />
            <component v-for="component in store.route.settings.actions" :is="component" :data="repo.data.value" />
        </template>
        <ptj-form v-if="repo.data.value['--id']" :schema="store.route.schema" :model="store.model" :data="repo.data.value" method="put" />
    </Panel>
</template>
<script setup>
import Panel from 'primevue/panel'
import { getStore } from "./../js/reactivestores.js"
import PtjForm from "./ptj-form.vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import PtjShowAudit from "./actions/ptj-show-audit.vue"


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