<template>
    <Button icon="pi pi-history" class="p-button-rounded p-button-success mr-2" @click="showAudit(slotProps.data)" />
    <Dialog v-model:visible="dialog" :header="'Audit ' + $t('models.' + store.name + '.title', 1)" :modal="true" class="p-fluid">
        <audit :repo="repo" :id="repo.active.value['--id']"/>
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/button"
    import Audit from "../effects/audit.vue"

    const props = defineProps({
        repo : Object,
    });

    const store = repo.store;


    const dialog = ref(false);


    function showAudit(data) {
        repo.active.value = data;
        dialog.value = (dialog.value) ? false : true;
    }

</script>