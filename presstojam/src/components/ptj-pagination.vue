<template>
    <Paginator :rows="store.pagination.rows_per_page" 
            :totalRecords="parseInt(store.pagination.count)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
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
    return ceil(props.store.pagination.count / props.store.pagination.rows_per_page);
});


function onPage(event) {
    props.store.pagination.offset = event.first;
    //, rows : event.rows, page : event.page };
    props.store.reload();
}


</script>