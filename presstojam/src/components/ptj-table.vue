<template>
    <DataTable :value="rows" v-model:selection="store.selected" dataKey="--id"
                responsiveLayout="scroll" @rowReorder="onRowReorder" 
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-model:expandedRows="expandedRows">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field v-model="slotProps.data[cell.name]" :field="cell" :model="model" :id="slotProps.data['--id']" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="model" :id="slotProps.data['--id']" />
                <ptj-edit-action :model="model" :store="store" :data="slotProps.data" />
            </template>
        </Column>
        <template #expansion="slotProps">
            <Card>
                <template #title>
                    {{ $t("models." + child + ".title") }}
                </template>
                <template #content>
                    <ptj-table-display :model="child" :store="childstore.store" />
                </template>
            </Card>
        </template>
    </DataTable>
</template>

<script setup>

import DataTable from "primevue/DataTable"
import Column from 'primevue/column';
import PtjViewField from "./ptj-view-field.vue"
import { ref } from "vue"
import PtjPrimaryAction from "./actions/ptj-primary-action.vue"
import PtjEditAction from "./actions/ptj-edit-action.vue"
import { getDataStoreById, hasStore, createStore } from "./../js/datastore.js"
import PtjTableDisplay from "./ptj-table-display.vue"
import Card from 'primevue/card';


const props = defineProps({
    model : String,
    store : Object,
    rows : Array,
    fields : Object
});

const emits = defineEmits([
    "reorder",
    "edit"
]);



function editRow(row) {
    emits('edit', row);
}

const has_primary = (props.store.route.children.length > 1) ? true : false;
const has_expandable = (props.store.route.children.length == 1) ? true : false;
const has_sort = props.store.route.sort;

function onRowReorder(e) {
   //need to emit
   emits('reorder', e.value)
}

let child = "";
let childstore = {};
if (has_expandable) {
    child = props.store.route.children[0]
    childstore = (hasStore(child)) ? getDataStoreById(child) : createStore(child);
}



const table_atts = {};
if (has_expandable) table_atts["v-model:expandedRows"] ="expandedRows";
 

//expandable rows function
const expandedRows = ref([]);
const onRowExpand = (event) => {
    expandedRows.value = [{"Time":"Coming"}];
    childstore.params = {"--parentid" : event.data["--id"]}
    childstore.load()
    .then(() => {
        expandedRows.value = childstore.store.data;
    });
};
const onRowCollapse = (event) => {
   expandedRows.value = [];
};


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table, thead, tbody, tr {
    width : 100%;
}


.ptj-table-wrapper {
    position : relative;
}


</style>