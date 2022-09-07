<template>
    <Panel header="store.model">
        <template #icons>
            <ptj-delete-action :data="[{ key : store.active.value['--id'], label : label }]" :model="store.model" />
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


const props = defineProps({
    store : Object
});

const label = computed(() => {
    return getLabel(props.store.route.schema, props.store.active.value);
});



</script>