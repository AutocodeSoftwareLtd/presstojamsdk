<template>
    <ptj-slug-trail />
    <Panel :header="store.route.title">

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
            <PtjTreeTable v-if="recursive" />
            <PtjTable v-else />
        </div>
    </div>
    </Panel>
</template>

<script setup>
import Button from "primevue/Button"
import Toolbar from 'primevue/Toolbar';
import FileUpload from 'primevue/FileUpload';
import Panel from 'primevue/panel';
import PtjTable from "./ptj-table.vue"
import PtjTreeTable from "./ptj-tree-table.vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { provide, ref, computed } from "vue"
import { getDataStoreById } from "./../js/datastore.js"

/*

*/
const props = defineProps({
    model : String,
    parentid : Number
});

const editDialog = ref(false);

provide("model", props.model);

const data_store = getDataStoreById(props.model);

const store =data_store.store;


function createRow() {
    store.active = {};
    editDialog.value = true;
}

const recursive = computed(() => {
    for(let i in store.route.schema) {
        if (store.route.schema[i].recursive) return true;
    }
    return false;
})


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