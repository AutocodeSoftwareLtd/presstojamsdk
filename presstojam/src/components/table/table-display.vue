<template>
  <div class="gc-table">
    <ptj-filter-form v-if="repo.pagination.rows_per_page && !store.no_filter"  :repo="repo" />
    <Message severity="success" v-if="newrow">New row created</Message>
    <Message severity="success" v-if="delrow">Rows removed</Message>
    <Message severity="success" v-if="editrow">Row Updated</Message>
    <Toolbar class="mb-4">
                <template #start>
                    <span class="p-input-icon-left mr-2" v-if="!repo.pagination.rows_per_page">
                        <i class="pi pi-search" />
                        <InputText v-model="search" placeholder="Keyword Search" />
                    </span>
                    <MultiSelect v-if="col_expandable"
                        v-model="active_options" 
                        :options="optional_fields"
                        placeholder="Select Columns" style="width: 20em"/>

                        
                </template>

                <template #end>
                    <ptj-import-action v-if="store.import" :name="name" />
                    <ptj-export-action v-if="store.export" :name="name" />
                    <ptj-create-action v-if="store.perms.includes('post')" :name="name" :model="store" :id="parseInt(repo.parent_id)"/> 
                    <ptj-delete-action :name="name" :data="selected.value" :store="repo" v-if="store.perms.includes('delete')"/>
                </template>
    </Toolbar>
    <p v-if="repo.pagination.rows_per_page">Total Rows: {{ repo.pagination.count }}</p>
    <div ref="group">
    <DataTable :value="repo.data.value" v-model:selection="selected.value" 
                dataKey="--id" :rowClass="rowClass"
                responsiveLayout="stack" :loading="repo.is_loading.value" 
                :rowHover="true" @rowReorder="onRowReorder" 
                v-model:expandedRows="expandedRows" 
                :globalFilterFields="global_filter_fields"
                :totalRecords="total_records"
                :filters="filters" v-bind="atts" v-on="events">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column v-if="store.perms.includes('delete')" selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.slug" :sortable="sortable"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field :row="slotProps.data" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="store.name" :id="slotProps.data['--id']" />
                <edit-action v-if="store.perms.includes('put')" :id="slotProps.data['--id']" :name="name" :model="store"/>
                <audit-action v-if="store.audit" :data="slotProps.data" :model="store" />
                <component v-for="component in store.actions" :is="component.component" v-bind="component.atts" :data="slotProps.data" :short="true" />
            </template>
        </Column>
        <template v-if="atts.groupRowsBy" #groupheader="slotProps">
            <div class="ptj-group" :class="slotProps.data[groupcell.name]"><ptj-view-field :row="slotProps.data" :field="groupcell" /></div>
        </template>
        <template #expansion="slotProps">
            <Card>
                <template #title>
                    {{ $t("models." + store.children_models[0] + ".title") }}
                </template>
                <template #content>
                    <ChildTable :name="store.children_models[0]" :id="slotProps.data['--id']" :key="slotProps.data['--parent']" />
                </template>
            </Card>
        </template>
    </DataTable>
    </div>
   </div>
</template>

<script setup>

import { ref, computed, onBeforeUnmount, onMounted } from "vue"
import PtjFilterForm from "../filter/filter-form.vue"
import MultiSelect from 'primevue/multiselect';
import Toolbar from 'primevue/Toolbar';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext'
import PtjExportAction from '../actions/export-action.vue'
import PtjCreateAction from '../actions/create-action.vue'
import PtjDeleteAction from '../actions/delete-action.vue'
import PtjImportAction from '../actions/import-action.vue'
import { subscribe, unsubscribe, trigger } from "../../js/bus/bus.js"
import Column from 'primevue/column';
import Card from 'primevue/card';
import { FilterMatchMode } from 'primevue/api';
import EditAction from "../actions/edit-action.vue"
import AuditAction from "../actions/audit-action.vue"
import PtjPrimaryAction from "../actions/primary-action.vue"
import PtjViewField from "../view/view-field.vue"
import DataTable from "primevue/DataTable"
import ChildTable from "./child-table.vue"



const props = defineProps({
    repo : Object,
    name : String
});

const group = ref();
const selected = ref([]);
const search = ref();
const active_options = ref();
const newrow = ref(false);
const delrow = ref(false);
const editrow = ref(false);


const store = props.repo.store;

const max_cols = (!store.max_cols) ? 10 : store.max_cols;

//setup cells
//const has_export = true;
store.setTableCells();
const cells = store.getEnabledCells();
const col_expandable = (Object.keys(cells).length > max_cols) ? true : false;
const fixed_fields = [];
const optional_fields = [];


props.repo.load();


const fields = computed(() => {
    const fcells = {};
    for(let i of fixed_fields) {
        fcells[i] = cells[i];
    }

    if (active_options.value) {
        for(let i of active_options.value) {
            fcells[i] = cells[i];
        }
    }

    return fcells;
});


for(let i in cells) {
    if (!col_expandable || fixed_fields.length < max_cols)  
        fixed_fields.push(i);
    else if (col_expandable) 
        optional_fields.push(i);
}


subscribe("effect_created", props.name, (name, response) => {
    if (props.name == name) {
        newrow.value = true;
        props.repo.addRow(response)
        trigger("dialog_close");
    }
});


subscribe("effect_edited", props.name, (name, id) => {
    if (props.name == name) {
        props.repo.editRow(id)
        editrow.value = true;
        trigger("dialog_close");
    }
});


subscribe("effect_deleted", props.name, (name, response) => {
    if (props.name == name) {
        delrow.value = true;
        trigger("dialog_close");
        props.repo.remove(response)
    }
});


onBeforeUnmount(() => {
    unsubscribe("effect_created", props.name);
    unsubscribe("effect_updated", props.name);
    unsubscribe("effect_delete", props.name)
});


const children = (store.fields['--id']) ? store.fields['--id'].reference : [];
const has_primary = (children.length > 1) ? true : false;
const has_expandable = (children.length == 1) ? true : false;
const has_sort = store.fields['--sort'];
const sortable = (!props.nosort && !props.repo.hasPagination() && !has_sort) ? true : false;
const global_filter_fields = [];
if (!props.repo.hasPagination()) {
    for(let field in props.fields) {
        global_filter_fields.push(field);
    }
}

const atts = {};
const events = {};
let groupcell;
if (store.group) {
    atts.rowGroupMode = "subheader";
    atts.groupRowsBy=store.group;
} else if (store.distinguish) {
    let id = store.distinguish;
    atts.rowClass = function(data) {
        return id + "-" + data[id];
    }
}


const total_records = computed(() => {
    return props.repo.pagination.count.value;
});


if (props.repo.hasPagination()) {
    atts.lazy = true;
    atts.paginator = true;
    atts.rows = props.repo.pagination.rows_per_page;
    atts.paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
    events.page = function(evt) {
        props.repo.setPagination(evt.page);
    }
}

groupcell = fields[store.group];

const filters = computed(() => {
    if (!props.search) return {};
    let filters = { 'global' : {  value : props.search, matchMode: FilterMatchMode.CONTAINS } };
    return filters;
});




function rowClass(data) {
    let classes = [];
    if (store.classes) {
        for(let cls of store.classes) {
            if (data[cls.att] == cls.value) classes.push(cls.class);
        }
    }
    return (classes.length) ? classes.join(" ") : null;
}


const table_atts = {};
if (has_expandable) {
    table_atts["v-model:expandedRows"] ="expandedRows";
}

//expandable rows function
const expandedRows = ref([]);




function onRowReorder(e) {
   //need to emit
   store.saveOrder(e.value);
}



onMounted (() => {
    const groupclasses = store.groupclasses
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table, thead, tbody, tr {
    width : 100%;
}


.ptj-table-wrapper {
    position : relative;
}


</style>