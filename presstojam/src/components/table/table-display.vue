<template>
    <ptj-filter-form v-if="repo.pagination && !store.nofilter"  :store="repo" />
    <Message severity="success" v-if="newrow">New row created</Message>
    <Message severity="success" v-if="delrow">Rows removed</Message>
    <Toolbar class="mb-4">
                <template #start>
                    <span class="p-input-icon-left mr-2" v-if="!repo.pagination">
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
                    <ptj-create-action v-if="store.perms.includes('post')" :name="name" :parent="store.parent" @onSave="onSave" /> 
                    <ptj-delete-action v-if="store.perms.includes('delete')" :name="name" @onDel="onDel"/>
                </template>
    </Toolbar>
    <p v-if="repo.pagination.rows_per_page">Total Rows: {{ repo.pagination.count }}</p>
    <ptj-table ref="dt" :name="name" :fields="fields" :search="search" @reorder="onRowReorder" />
</template>

<script setup>

import { ref, computed, onBeforeUnmount } from "vue"
import PtjFilterForm from "../filter/filter-form.vue"
import MultiSelect from 'primevue/multiselect';
import Toolbar from 'primevue/Toolbar';
import PtjTable from "./table.vue"
import Message from 'primevue/message';
import InputText from 'primevue/inputtext'
import { getStore } from "../../js/data/storemanager.js"
import PtjExportAction from '../actions/export-action.vue'
import PtjCreateAction from '../actions/create-action.vue'
import PtjDeleteAction from '../actions/delete-action.vue'
import PtjImportAction from '../actions/import-action.vue'
import { subscribe, unsubscribe } from "../../js/bus/bus.js"




const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const repo = getStore(props.name);
const store = repo.store;


const max_cols = (!store.max_cols) ? 10 : store.max_cols;


//const has_export = true;
store.setTableCells();
const cells = store.getEnabledCells();
const col_expandable = (Object.keys(cells).length > max_cols) ? true : false;
const fixed_fields = [];
const optional_fields = [];


const search = ref();
const dt = ref();

const active_options = ref();
const newrow = ref(false);
const delrow = ref(false);



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



function onRowReorder(rows) {
    repo.data.value =rows;
    store.saveOrder(rows);
}



function onSave() {
    repo.reload()
    newrow.value = true;
}


function onDel() {
    repo.reload();
    delrow.value = true;
}


subscribe("form_saved", props.name, response => {
    newrow.value = true;
});

subscribe("deleted", props.name, response => {
    repo.remove(response);
    delrow.value = true;
});

onBeforeUnmount(() => {
    unsubscribe("form_saved", props.name);
    unsubscribe("delete", props.name)
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