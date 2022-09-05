<template>
    <DataTable :value="rows" v-model:selection="store.selected" dataKey="--id"
                responsiveLayout="scroll" @rowReorder="onRowReorder" 
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-bind="table_atts">
        <Column v-if="has_expandable" :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in fields" :field="cell.name"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">
                <ptj-view-field v-model="slotProps.data[cell.name]" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="model" :id="slotProps.data['--id']" />
                <ptj-edit-action :model="model" :store="store" :data="slotProps.data" />
            </template>
        </Column>
        <template #expansion="slotProps">
                <div class="orders-subtable">
                    <h5>Orders for {{slotProps.data.name}}</h5>
                    <DataTable :value="slotProps.data.orders" responsiveLayout="scroll">
                        <Column field="id" header="Id" sortable></Column>
                        <Column field="customer" header="Customer" sortable></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column field="amount" header="Amount" sortable>
                            <template #body="slotProps" sortable>
                                {{formatCurrency(slotProps.data.amount)}}
                            </template>
                        </Column>
                        <Column field="status" header="Status" sortable>
                            <template #body="slotProps">
                                <span :class="'order-badge order-' + slotProps.data.status.toLowerCase()">{{slotProps.data.status}}</span>
                            </template>
                        </Column>
                       
                    </DataTable>
                </div>
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
import { getDataStoreById } from "./../js/datastore.js"


const props = defineProps({
    model : String,
    store : Object,
    rows : Array
});

const emits = defineEmits([
    "reorder",
    "edit"
]);



function editRow(row) {
    emits('edit', row);
}


let max_cols = 8;

const has_primary = (props.store.route.children.length > 1) ? true : false;
const has_expandable = (props.store.route.children.length == 1) ? true : false;
const col_expandable = (Object.keys(props.store.route.schema).length > max_cols) ? true : false;
const has_sort = props.store.route.sort;
console.log("is expandable", has_expandable, props.model, props.store.route.children, props.store.route.children.length);

function onRowReorder(e) {
   //need to emit
   emits('reorder', e.value)
}

const fixed_fields = [];
const optional_fields = [];
for(let i in props.store.route.schema) {
    if (props.store.route.schema[i].background) continue;
    if (!col_expandable || fixed_fields.length < max_cols)  
        fixed_fields.push(i);
    else if (col_expandable) 
        optional_fields.push(i);
}

const active_options = ref();

const fields = computed(() => {
    const cells = {};
    for(let i of fixed_fields) {
        cells[i] = props.store.route.schema[i];
    }

    if (active_options.value) {
        for(let i of active_options.value) {
            cells[i] = props.store.route.schema[i];
        }
    }
    return cells;
});

const table_atts = {};
if (has_expandable) table_atts["v-model:expandedRows"] ="expandedRows";
 

//expandable rows function
const expandedRows = ref([]);
const onRowExpand = (event) => {
    expandedRows.value = [];
    let store = getDataStoreById(props.store.route.children[0]);
    store.params = {"--parentid" : event.data["--id"]}
    store.load()
    .then(() => {
        expandedRows.value = store.data;
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