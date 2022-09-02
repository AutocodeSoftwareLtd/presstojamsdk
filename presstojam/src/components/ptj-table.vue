<template>
    <ptj-filter-form />
    <DataTable :value="store.data" v-model:selection="store.selected" dataKey="--id" 
                :paginator="true" :rows="10" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                responsiveLayout="scroll">
    
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
                <router-link v-if="has_primary" :to="{ name : 'primary', params : {'model' : model, 'id' : slotProps.data['--id']}}"
                    v-slot="{isActive, href, navigate, isExactActive}">
                    <a 
                        :class="{'active-link': isActive}" 
                        :href="href"
                        @click="navigate"
                    ><Button 
                        icon="pi pi-chevron-right" 
                        class="p-button-rounded p-button-success mr-2" 
                        /></a>
                </router-link>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
</template>

<script setup>

import Button from "primevue/Button"
import DataTable from "primevue/DataTable"
import Column from 'primevue/column';
import PtjViewField from "./ptj-view-field.vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import { inject, ref, computed } from "vue"
import { getDataStoreById } from "./../js/datastore.js"



/*

*/
const editDialog = ref(false);
const model = inject("model");

const data_store = getDataStoreById(model);

const store =data_store.store;


function editRow(row) {
    store.active = { ...row };
    editDialog.value =true;
}

function createRow() {
    store.active = {};
    editDialog.value = true;
}

let max_cols = 8;

const has_primary = (store.route.children.length > 1) ? true : false;
const has_expandable = (store.route.children.length == 1) ? true : false;
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;


function confirmDeleteRow(product) {
    
}

let fields = computed(() => {
    let cells = {};
    for(let i in store.route.schema) {
        if (store.route.schema[i].background) continue;
        cells[i] = store.route.schema[i];
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