<template>
    <DataTable :value="rows" v-model:selection="isselected" dataKey="--id" :rowClass="rowClass"
                responsiveLayout="scroll" :loading="store.is_loading" :rowHover="true" @rowReorder="onRowReorder" @rowSelect="onRowSelect"
                @rowUnselect="onRowUnselect" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" 
                v-model:expandedRows="expandedRows" :globalFilterFields="global_filter_fields"
                :filters="filters" v-bind="atts">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column selectionMode="multiple" v-if="store.route.perms.includes('delete')" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name" :sortable="sortable"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field :row="slotProps.data" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="model" :id="slotProps.data['--id']" />
                <ptj-edit-action v-if="store.route.perms.includes('put')" :model="model" :store="store" :data="slotProps.data" @onSave="onSaveEdit" />
                <ptj-show-audit v-if="store.route.audit" :short="true" :store="store" :id="slotProps.data['--id']" />
            </template>
        </Column>
        <template v-if="atts.groupRowsBy" #groupheader="slotProps">
            <div :class="slotProps.data[groupcell.name]"><ptj-view-field :row="slotProps.data" :field="groupcell" /></div>
        </template>
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
import PtjShowAudit from "./actions/ptj-show-audit.vue"
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
    search : [Object, String],
    nosort : {
        type : Boolean,
        default : false
    }
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


const children = (props.store.route.schema['--id']) ? props.store.route.schema['--id'].reference : [];
const has_primary = (children.length > 1) ? true : false;
const has_expandable = (children.length == 1) ? true : false;
const has_sort = props.store.route.schema['--sort'];
const isselected = ref();
const sortable = (!props.nosort && !props.store.pagination.count && !has_sort) ? true : false;
const global_filter_fields = [];
if (!props.store.pagination.count) {
    for(let field in props.fields) {
        global_filter_fields.push(field);
    }
}

const atts = {};
let groupcell;
if (props.store.route.settings.group) {
    atts.rowGroupMode = "subheader";
    atts.groupRowsBy=props.store.route.settings.group;
   // atts.sortMode="single";
   // atts.sortField = props.store.route.settings.group;
   // atts.sortOrder=1;
}

groupcell = props.fields[props.store.route.settings.group];

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
        event.data.children = [...childstore.data.value];
    });
};
const onRowCollapse = (event) => {
   event.data.children = [];
};



</script>