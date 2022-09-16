<template>
    <DataTable :value="rows" v-model:selection="isselected" dataKey="--id" :rowClass="rowClass"
                responsiveLayout="scroll" :rowHover="true" @rowReorder="onRowReorder" @rowSelect="onRowSelect"
                @rowUnselect="onRowUnselect" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" 
                v-model:expandedRows="expandedRows" :globalFilterFields="global_filter_fields"
                :filters="filters">
                <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name" :sortable="true"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field v-model="slotProps.data[cell.name]" :field="cell" :model="model" :id="slotProps.data['--id']" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="model" :id="slotProps.data['--id']" />
                <ptj-edit-action :model="model" :store="store" :data="slotProps.data" @onSave="onSaveEdit" />
            </template>
        </Column>
        <template #expansion="slotProps">
            <Card>
                <template #title>
                    {{ $t("models." + child + ".title") }}
                </template>
                <template #content>
                    <ptj-table-display :model="child" :store="childstore" />
                </template>
            </Card>
        </template>
    </DataTable>
</template>

<script setup>

import DataTable from "primevue/DataTable"
import Column from 'primevue/column';
import PtjViewField from "./ptj-view-field.vue"
import { ref, computed } from "vue"
import PtjPrimaryAction from "./actions/ptj-primary-action.vue"
import PtjEditAction from "./actions/ptj-edit-action.vue"
import { hasStore, createDataStore, getStoreById } from "./../js/datastore.js"
import PtjTableDisplay from "./ptj-table-display.vue"
import Card from 'primevue/card';
import { getLabel } from "../js/helperfunctions";
import { FilterMatchMode } from 'primevue/api';



const props = defineProps({
    model : String,
    store : Object,
    rows : Array,
    fields : Object,
    search : [Object, String]
});

const emits = defineEmits([
    "reorder",
    "edit"
]);


function editRow(row) {
    emits('edit', row);
}

function onSaveEdit() {
    props.store.overwrite(props.store.active.value);
}


const children = props.store.route.schema['--id'].reference;
const has_primary = (children.length > 1) ? true : false;
const has_expandable = (children.length == 1) ? true : false;
const has_sort = props.store.route.schema['--sort'];
const isselected = ref();
const sortable = (!props.store.pagination.count && !has_sort) ? true : false;
const global_filter_fields = [];
if (!props.store.pagination.count) {
    for(let field in props.fields) {
        global_filter_fields.push(field);
    }
}

const filters = computed(() => {
    if (!props.search) return {};
    let filters = { 'global' : {  value : props.search, matchMode: FilterMatchMode.CONTAINS } };
    return filters;
});

function onRowSelect(e) {
    if (!props.store.selected.value) props.store.selected.value = [];
    props.store.selected.value.push({ key : e.data['--id'], label : getLabel(props.store.route.schema, e.data)});
}

function onRowUnselect(e) {
    props.store.selected.value = props.store.selected.value.filter(item => item.key !== e.data['--id']);
}

function onRowReorder(e) {
   //need to emit
   console.log("Value is", e.value);
   emits('reorder', e.value)
}

let child = "";
let childstore = {};
if (has_expandable) {
    child = props.store.route.children[0];
    childstore = (hasStore(child)) ? getStoreById(child) : createDataStore(child);
    childstore.parent_store = props.store;
}


function rowClass(data) {
    let classes = [];
    if (props.store.route.settings.classes) {
        for(let cls of props.store.route.settings.classes) {
            if (data[cls.att] == cls.value) classes.push(cls.class);
        }
    }
    return (classes.length) ? classes.join(" ") : null;
}


const table_atts = {};
if (has_expandable) table_atts["v-model:expandedRows"] ="expandedRows";
 

//expandable rows function
const expandedRows = ref([]);
const onRowExpand = (event) => {
    //expandedRows.value = [{"Time":"Coming"}];
    props.store.active.value = event.data;
    childstore.reload()
    .then(() => {
        console.log("Data is", childstore.data.value);
        event.data.children = [...childstore.data.value];
    });
};
const onRowCollapse = (event) => {
   event.data.children = [];
};


function resort() {

}

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