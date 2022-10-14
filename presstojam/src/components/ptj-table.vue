<template>
    <div ref="group">
    <DataTable :value="repo.data.value" v-model:selection="repo.selected.value" dataKey="--id" :rowClass="rowClass"
                responsiveLayout="scroll" :loading="repo.is_loading.value" :rowHover="true" @rowReorder="onRowReorder" 
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" 
                v-model:expandedRows="expandedRows" :globalFilterFields="global_filter_fields"
                :filters="filters" v-bind="atts">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name" :sortable="sortable"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field :row="slotProps.data" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="store.model" :id="slotProps.data['--id']" />
                <Button v-if="store.route.perms.includes('put')" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="showEdit(slotProps.data)" />
                <Button v-if="store.route.audit" icon="pi pi-history" class="mr-2 p-button-rounded p-button-success" @click="showAudit(slotProps.data)" />
                
            </template>
        </Column>
        <template v-if="atts.groupRowsBy" #groupheader="slotProps">
            <div class="ptj-group" :class="slotProps.data[groupcell.name]"><ptj-view-field :row="slotProps.data" :field="groupcell" /></div>
        </template>
        <template #expansion="slotProps">
            <Card v-if="childstore">
                <template #title>
                    {{ $t("models." + childstore.model + ".title") }}
                </template>
                <template #content>
                    <ptj-table-display :name="childstore.model" />
                </template>
            </Card>
        </template>
    </DataTable>
    <Dialog v-if="store.route.audit" v-model:visible="show_audit" header="Audit" :modal="true" class="p-fluid">
        <audit :repo="repo" />
    </Dialog>
    <Dialog v-if="store.route.perms.includes('put')" v-model:visible="show_edit" :header="'Edit ' + $t('models.' + store.model + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-form :schema="store.route.schema" :data="repo.active.value" :model="store.model" @saved="hideEdit()" @dataChanged="updated" method="put"/>
    </Dialog>
    </div>
</template>

<script setup>

import DataTable from "primevue/DataTable"
import Column from 'primevue/column';
import PtjViewField from "./ptj-view-field.vue"
import { ref, computed, onMounted } from "vue"
import PtjPrimaryAction from "./actions/ptj-primary-action.vue"
import {  createDataStore } from "./../js/datastore.js"
import PtjTableDisplay from "./ptj-table-display.vue"
import Card from 'primevue/card';
import { FilterMatchMode } from 'primevue/api';
import { getStore, createRepoStore, regStore } from "./../js/reactivestores.js"
import Button from "primevue/Button"
import Dialog from 'primevue/dialog'
import Audit from "./effects/audit.vue"
import PtjForm from "./ptj-form.vue"


const props = defineProps({
    name : String,
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

const repo = getStore(props.name);
const store = repo.store;

const group = ref();
const show_edit = ref(false);
const show_audit = ref(false);

function editRow(row) {
    emits('edit', row);
}





const children = (store.route.schema['--id']) ? store.route.schema['--id'].reference : [];
const has_primary = (children.length > 1) ? true : false;
const has_expandable = (children.length == 1) ? true : false;
const has_sort = store.route.schema['--sort'];
const sortable = (!props.nosort && !repo.pagination && !has_sort) ? true : false;
const global_filter_fields = [];
if (!repo.pagination) {
    for(let field in props.fields) {
        global_filter_fields.push(field);
    }
}

const atts = {};
let groupcell;
if (store.route.settings.group) {
    atts.rowGroupMode = "subheader";
    atts.groupRowsBy=store.route.settings.group;
   // atts.sortMode="single";
   // atts.sortField = store.route.settings.group;
   // atts.sortOrder=1;
}

groupcell = props.fields[store.route.settings.group];

const filters = computed(() => {
    if (!props.search) return {};
    let filters = { 'global' : {  value : props.search, matchMode: FilterMatchMode.CONTAINS } };
    return filters;
});



function updated(data) {
    repo.overwrite(data);
} 

function onRowReorder(e) {
   //need to emit
   emits('reorder', e.value)
}

function hideEdit() {
    show_edit.value = false;
}

function showEdit(data) {
    repo.active.value = data;
    show_edit.value = true;
}


function showAudit(data) {
    repo.active.value = data;
    show_audit.value = (show_audit.value) ? false : true;
}

let childstore = null;
let childrepo = null;
if (has_expandable) {
    childstore = createDataStore(store.route.children[0]);
}


function rowClass(data) {
    let classes = [];
    if (store.route.settings.classes) {
        for(let cls of store.route.settings.classes) {
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
    childrepo = null;
    repo.active.value = event.data;
    childstore.parent_id = repo.active.value['--id'];
    childrepo = createRepoStore(childstore);
    regStore(childstore.model, childrepo);
    childrepo.reload();
};
const onRowCollapse = (event) => {
   event.data.children = [];
};


onMounted (() => {
    const groupclasses = store.route.settings.groupclasses
    if (groupclasses) {
        for(const cls in groupclasses) {
            const val = groupclasses[cls]
            
            //apply to the rows retroactively
            let tgs = group.value.getElementsByClassName(cls);
            for(let el of tgs) {
                if (el.classList.contains("ptj-group")) {
                    let pel=el.closest(".p-rowgroup-header");
                    pel.classList.add(val);
                    while(pel=pel.nextElementSibling) {
                        if (pel.classList.contains('p-rowgroup-header')) {
                            break;
                        }
                        pel.classList.add(val);
                    }
                }
            }
        }
    }
});


</script>