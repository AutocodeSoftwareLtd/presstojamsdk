<template>
    <ptj-filter-form :model="model" :store="store" v-if="!active_store.route.settings.nofilter" />
    <Message severity="success" v-if="newrow">New row created</Message>
    <Message severity="success" v-if="delrow">Rows removed</Message>
    <Toolbar class="mb-4">
                <template #start>
                    <MultiSelect v-if="col_expandable"
                        v-model="active_options" 
                        :options="optional_fields"
                        placeholder="Select Columns" style="width: 20em"/>
                </template>

                <template #end>
                    <ptj-create-action :model="model" :store="store" @onSave="onSave"/> 
                    <ptj-delete-action :data="store.selected.value" :model="model" @onDel="onDel"/>
                       
                    
                </template>
    </Toolbar>
    
    <ptj-table :model="model" :store="store" :fields="fields" :rows="store.data.value" @reorder="onRowReorder" />
    <ptj-pagination v-if="store.count" :model="model" :store="store" />
</template>

<script setup>

import { ref, computed } from "vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjPagination from "./ptj-pagination.vue";
import MultiSelect from 'primevue/multiselect';
import Toolbar from 'primevue/Toolbar';
import PtjTable from "./ptj-table.vue"
import PtjCreateAction from "./actions/ptj-create-action.vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import Message from 'primevue/message';
import { getStoreById } from "./../js/datastore.js"
import  {saveOrder } from "./../js/helperfunctions.js" 


const props = defineProps({
    model : String,
    store : Object
});

const active_store = getStoreById(props.model);
const max_cols = (!active_store.route.settings.max_cols) ? 10 : active_store.route.settings.max_cols;

const col_expandable = (Object.keys(props.store.route.schema).length > max_cols) ? true : false;


function onRowReorder(rows) {
    console.log("Value is", rows);
    props.store.data.value =rows;
    saveOrder(props.model, rows);
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


const newrow = ref(false);
const delrow = ref(false);

function onSave() {
    props.store.reload();
    newrow.value = true;
}


function onDel() {
    props.store.reload();
    props.store.selected.value = [];
    delrow.value = true;
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