<template>
    <div ref="group">
    <DataTable :value="data" v-model:selection="repo.selected.value" dataKey="--id" :rowClass="rowClass"
                responsiveLayout="stack" :loading="repo.is_loading.value" :rowHover="true" @rowReorder="onRowReorder" 
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" 
                v-model:expandedRows="expandedRows" :globalFilterFields="global_filter_fields"
                :filters="filters" v-bind="atts">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column v-if="store.perms.includes('delete')" selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name" :sortable="sortable"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field :row="slotProps.data" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="store.name" :id="slotProps.data['--id']" />
                <edit-action v-if="store.perms.includes('put')" :data="slotProps.data" :model="store" />
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
                    <ChildTable :name="store.children_models[0]" :parent_id="slotProps.data['--id']" :key="slotProps.data['--id']" />
                </template>
            </Card>
        </template>
    </DataTable>
    </div>
</template>

<script setup>

import Column from 'primevue/column';
import { ref, computed, onMounted } from "vue"
import Card from 'primevue/card';
import { FilterMatchMode } from 'primevue/api';
import { getStore } from "../../js/data/storemanager.js"
import EditAction from "../actions/edit-action.vue"
import AuditAction from "../actions/audit-action.vue"

import PtjPrimaryAction from "../actions/primary-action.vue"

import PtjViewField from "../view/view-field.vue"
import DataTable from "primevue/DataTable"
import ChildTable from "./child-table.vue"



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

const data = ref([]);

repo.load()
.then(rows => {
    data.value = rows;
});


const children = (store.fields['--id']) ? store.fields['--id'].reference : [];
const has_primary = (children.length > 1) ? true : false;
const has_expandable = (children.length == 1) ? true : false;
const has_sort = store.fields['--sort'];
const sortable = (!props.nosort && !repo.pagination && !has_sort) ? true : false;
const global_filter_fields = [];
if (!repo.pagination) {
    for(let field in props.fields) {
        global_filter_fields.push(field);
    }
}

const atts = {};
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

groupcell = props.fields[store.group];

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
if (has_expandable) table_atts["v-model:expandedRows"] ="expandedRows";

//expandable rows function
const expandedRows = ref([]);
const onRowExpand = (event) => {
    //expandedRows.value = [{"Time":"Coming"}];
    event.data.children = [];
    repo.active.value = event.data;
};

const onRowCollapse = (event) => {
   event.data.children = [];
};


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