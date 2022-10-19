<template>
    <Button 
        label="Audit" 
        icon="pi pi-history" 
        class="mr-2 p-button-help"
        @click="showAudit" />
    <Dialog v-model:visible="dialog" header="Audit" :modal="true" class="p-fluid">
        <audit :repo="repo" :id="repo.active_id" />
    </Dialog>
</template>
<script setup>
import Button from "primevue/Button"
import { ref } from "vue"
import Dialog from 'primevue/dialog'
import Audit from "./../effects/audit.vue"



const props = defineProps({
    repo : Object
});

const dialog = ref(false);


function showAudit() {
    dialog.value = true;
}

</script>