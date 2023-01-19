<template>

    <Button icon="pi pi-upload" class="mr-2" @click="toggleImport">Import</Button>
    <Dialog v-model:visible="dialog" :header="'Import ' + $t('models.' + repo.store.name + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-import :name="name" />
    </Dialog>
</template>
<script setup>
    import { ref } from "vue"
    import Button from "primevue/button"
    import Dialog from 'primevue/dialog'
    import PtjImport from "./../import/import.vue"
    import { getStore } from "../../js/data/storemanager.js"

    const dialog = ref(false);

    const props = defineProps({
        name : String
    });

    const repo = getStore(props.name);

    function toggleImport() {
        dialog.value = (dialog.value) ? false : true;
    }
</script>