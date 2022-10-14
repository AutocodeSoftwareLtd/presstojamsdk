<template>
    <ptj-filter-form v-if="repo.pagination.count && !store.route.settings.nofilter"  :store="store" />
    <Message severity="success" v-if="newrow">New row created</Message>
    <Message severity="success" v-if="delrow">Rows removed</Message>
    <Toolbar class="mb-4">
                <template #start>
                    <span class="p-input-icon-left mr-2" v-if="!repo.pagination.count">
                        <i class="pi pi-search" />
                        <InputText v-model="search" placeholder="Keyword Search" />
                    </span>
                    <MultiSelect v-if="col_expandable"
                        v-model="active_options" 
                        :options="optional_fields"
                        placeholder="Select Columns" style="width: 20em"/>

                        
                </template>

                <template #end>
                    <ptj-export-action v-if="has_export" :name="name" />
                    <ptj-create-action v-if="store.route.perms.includes('post')" :name="name" @onSave="onSave" /> 
                    <ptj-delete-action v-if="store.route.perms.includes('delete')" :name="name" @onDel="onDel"/>
                </template>
    </Toolbar>
    <p v-if="repo.pagination.count">Total Rows: {{ repo.pagination.count }}</p>
    <ptj-table ref="dt" :name="name" :fields="fields" :search="search" @reorder="onRowReorder" />
    <ptj-pagination v-if="repo.pagination.count" :pagination="repo.pagination" @reload="reloadPage" />
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
import  {saveOrder } from "./../js/helperfunctions.js" 
import InputText from 'primevue/inputtext'
import PtjExportAction from './actions/ptj-export-action.vue'
import { getStore } from "./../js/reactivestores.js"



const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const repo = getStore(props.name);
const store = repo.store;


const max_cols = (!store.route.settings.max_cols) ? 10 : store.route.settings.max_cols;
const has_export =store.route.export;
//const has_export = true;
const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;
const fixed_fields = [];
const optional_fields = [];


const search = ref();
const dt = ref();

const active_options = ref();
const newrow = ref(false);
const delrow = ref(false);



const fields = computed(() => {
    const cells = {};
    for(let i of fixed_fields) {
        cells[i] = store.route.schema[i];
    }

    if (active_options.value) {
        for(let i of active_options.value) {
            cells[i] = store.route.schema[i];
        }
    }

    return cells;
});


for(let i in store.route.schema) {
    if (store.route.schema[i].background) continue;
    if (!col_expandable || fixed_fields.length < max_cols)  
        fixed_fields.push(i);
    else if (col_expandable) 
        optional_fields.push(i);
}


function reloadPage(offset) {
    repo.pagination.offset = offset;
    repo.paginate();
}


function onRowReorder(rows) {
    repo.data.value =rows;
    saveOrder(store.model, rows);
}



function onSave() {
    repo.reload()
    newrow.value = true;
}


function onDel() {
    repo.reload();
    selected.value = [];
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