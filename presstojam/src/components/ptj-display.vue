<template>
    <Panel header="model">
        <template #icons>
            <ptj-delete-action :data="[{ key : store.active['--id'], label : label }]" :model="model" />
        </template>
        <ptj-form :model="model" :store="store" />
    </Panel>
</template>
<script setup>
import PtjForm from "./ptj-form.vue"
import Panel from 'primevue/panel'
import { ref, computed } from "vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import { getLabel } from "./../js/helperfunctions.js"


const props = defineProps({
    model : String,
    store : Object
});

const delDialog = ref(false);

const label = computed(() => {
    return getLabel(props.store.route.schema, props.store.active);
});



</script>