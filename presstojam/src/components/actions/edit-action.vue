<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
    <Dialog v-model:visible="dialog" :header="'Edit ' + $t('models.' + model.name + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-form :model="model" :data="data" @saved="onSave" method="put" key="edit" />
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/button"
    import PtjForm from "./../form/form.vue"

    const props = defineProps({
        model : Object,
        data : Object
    });



    const emits = defineEmits([
        'onSave'
    ]);

    const dialog = ref(false);

    function editRow() {
        dialog.value =true;
    }

    function onSave() {
        dialog.value = false;
        emits('onSave');
    }


</script>