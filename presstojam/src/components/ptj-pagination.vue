<template>
    <Paginator :rows="store.rows_per_page" :totalRecords="parseInt(store.count)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
            @page="onPage($event)">
    </Paginator>
</template>
<script setup>
import Paginator from 'primevue/paginator';
import { computed } from "vue"

const props = defineProps({
    model : String,
    store : Object
});

const pages = computed(() => {
    return ceil(store.pagination.count / store.pagination.rows_per_page);
});


function onPage(event) {
    const store = getDataStoreById(props.model);
    store.pagination.offset = event.first;
    //, rows : event.rows, page : event.page };
    store.reload();
}


</script>