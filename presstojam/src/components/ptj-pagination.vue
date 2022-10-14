<template>
    <Paginator :rows="pagination.rows_per_page" 
            :totalRecords="parseInt(pagination.count)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
            @page="onPage($event)">
    </Paginator>
</template>
<script setup>
import Paginator from 'primevue/paginator';
import { computed } from "vue"

const props = defineProps({
    pagination : Object
});

const pages = computed(() => {
    return ceil(props.pagination.count / props.pagination.rows_per_page);
});

const emits = defineEmits(["reload"]);

function onPage(event) {
    emits("reload", event.first);
}


</script>