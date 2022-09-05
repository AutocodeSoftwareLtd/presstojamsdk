<template>
    <ptj-filter-form :model="model" :store="store" />
    <Toolbar class="mb-4">
                <template #start>
                    <MultiSelect v-if="col_expandable"
                        v-model="active_options" 
                        :options="optional_fields"
                        placeholder="Select Columns" style="width: 20em"/>
                </template>

                <template #end>
                    <Button style="float:right" label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="createRow" /> 
                    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="!store.selected || !store.selected.length" />
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                        class="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" class="p-button-help"  />
                </template>
    </Toolbar>
    <ptj-table :model="model" :store="store" :rows="store.data" @reorder="onRowReorder" @edit="editRow" />
    <ptj-pagination v-if="store.count" :model="model" :store="store" />
    <Dialog v-model:visible="editDialog" :style="{width: '450px'}" :header="props.model" :modal="true" class="p-fluid">
        <ptj-form :model="model" :store="store" />
    </Dialog>
</template>

<script setup>

import Button from "primevue/Button"
import { ref, computed } from "vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjPagination from "./ptj-pagination.vue"
import PtjForm from "./ptj-form.vue"
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Toolbar from 'primevue/Toolbar';
import PtjTable from "./ptj-table.vue"
import FileUpload from 'primevue/FileUpload';


const props = defineProps({
    model : String,
    store : Object
});

const editDialog = ref(false);


function editRow(row) {
    props.store.active = { ...row };
    editDialog.value =true;
}

function createRow() {
    props.store.active = {};
    editDialog.value = true;
}

let max_cols = 8;

const has_primary = (props.store.route.children.length > 1) ? true : false;
const has_expandable = (props.store.route.children.length == 1) ? true : false;
const col_expandable = (Object.keys(props.store.route.schema).length > max_cols) ? true : false;
const has_sort = props.store.route.sort;

function confirmDeleteRow(product) {
    
}

function onRowReorder(e) {
    props.store.data = e.value;
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