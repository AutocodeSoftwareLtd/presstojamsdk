<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="createRow" />
                    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="!store.selected || !store.selected.length" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                        class="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" class="p-button-help"  />
                </template>
            </Toolbar>

            <DataTable :value="store.data" v-model:selection="store.selected" dataKey="--id" 
                :paginator="true" :rows="10" 
                v-model:filters="store.filters" filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                responsiveLayout="scroll">
    
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column v-for="cell in cells" :field="cell.name"
                    :header="getDictionary('label', { model: cell.name, field: cell.name, default: cell.name })"
                    :key="cell.name">
                    <template #filter>
                        <ptj-filter-field :field="cell" class="p-column-filter" />
                    </template>
                    <template #body="slotProps">
                        <ptj-view-field v-model="slotProps.data[cell.name]" :field="cell" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRow(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="editDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
        <PtjForm />
    </Dialog>

</template>

<script setup>
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import Button from "primevue/Button"
import DataTable from "primevue/DataTable"
import Column from 'primevue/column';
import Row from 'primevue/row';  //optional for row
import Dialog from 'primevue/dialog';
import PtjViewField from "./ptj-view-field.vue"
import PtjFilterField from "./ptj-filter-field.vue"
import PtjForm from "./ptj-form.vue"
import { provide, ref, computed } from "vue"
import { getDictionary } from "./../js/dictionary.js"
import { routeStore } from './../js/controller.js'
import { getMeta } from "./../js/metalibrary.js"
import { getData } from "./../js/datastore.js"

/*

*/
const editDialog = ref(false);
const cells = ref({});


provide("meta", cells);




const data_store = getData(routeStore.route.name);
const store =data_store.store;
provide("store", store);

getMeta(routeStore.route.name)
.then(mcells=> {
    cells.value = mcells;
    data_store.createFilters(cells.value);
});


function editRow(row) {
    store.active = { ...row };
    editDialog.value =true;
}

function createRow() {
    store.active = {};
    editDialog.value = true;
}


function confirmDeleteRow(product) {
    
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