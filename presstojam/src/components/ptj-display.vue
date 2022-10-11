<template>
    <Panel :header="$t('models.' + store.model + '.title')">
        <template #icons>
            <ptj-show-audit v-if="store.route.audit" :id="store.active.value['--id']" :store="store" />
            <ptj-delete-action :data="[{ key : store.active.value['--id'], label : label }]" :single="true" :model="store.model" />
        </template>
        <ptj-form :store="store" />
    </Panel>
</template>
<script setup>
import PtjForm from "./ptj-form.vue"
import Panel from 'primevue/panel'
import { computed } from "vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import { getLabel } from "./../js/helperfunctions.js"
import PtjShowAudit from "./actions/ptj-show-audit.vue"



const props = defineProps({
    store : Object
});

const label = computed(() => {
    return getLabel(props.store.route.schema, props.store.active.value);
});



</script>