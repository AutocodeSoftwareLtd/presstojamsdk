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
                    <ptj-create-action v-if="store.perms.includes('post')" :name="name" @onSave="onSave" /> 
                    <ptj-delete-action v-if="store.perms.includes('delete')" :name="name" @onDel="onDel"/>
                </template>
    </Toolbar>
    <p v-if="repo.pagination.rows_per_page">Total Rows: {{ repo.pagination.count }}</p>
    <ptj-table ref="dt" :name="name" :fields="fields" :search="search" @reorder="onRowReorder" />
    <ptj-pagination v-if="repo.pagination.rows_per_page" :pagination="repo.pagination" @reload="reloadPage" />
</template>

<script setup>

import { ref, computed } from "vue"
import PtjFilterForm from "../filter/filter-form.vue"
import PtjPagination from "../paginator/pagination.vue";
import MultiSelect from 'primevue/multiselect';
import Toolbar from 'primevue/Toolbar';
import PtjTable from "./table.vue"
import Message from 'primevue/message';
import  {saveOrder } from "../../js/helperfunctions.js" 
import InputText from 'primevue/inputtext'
import { getStore } from "../../js/data/storemanager.js"
import PtjExportAction from '../actions/export-action.vue'
import PtjCreateAction from '../actions/create-action.vue'
import PtjDeleteAction from '../actions/delete-action.vue'
import PtjImportAction from '../actions/import-action.vue'




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
const col_expandable = (Object.keys(store.fields).length > max_cols) ? true : false;
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
        cells[i] = store.fields[i];
    }

    if (active_options.value) {
        for(let i of active_options.value) {
            cells[i] = store.fields[i];
        }
    }

    return cells;
});


for(let i in store.fields) {
    if (store.fields[i].background) continue;
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
    saveOrder(store.name, rows);
}



function onSave() {
    repo.reload()
    newrow.value = true;
}


function onDel() {
    repo.reload();
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