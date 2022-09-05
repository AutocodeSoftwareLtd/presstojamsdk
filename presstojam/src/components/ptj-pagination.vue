<template>
    <Paginator :rows="store.rows_per_page" :totalRecords="store.count"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
            @page="onPage($event)">
    </Paginator>
</template>
<script setup>
import Paginator from 'primevue/paginator';
import { computed } from "vue"
import { getDataStoreById } from "./../js/datastore.js"

const props = defineProps({
    model : String,
    store : Object
});

const pages = computed(() => {
    return ceil(store.count / store.rows_per_page);
});


function onPage(event) {
    const store = getDataStoreById(props.model);
    store.paginate = { first : event.first, rows : event.rows, page : event.page };
    store.reload();
}


</script>