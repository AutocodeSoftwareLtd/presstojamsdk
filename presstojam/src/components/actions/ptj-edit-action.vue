<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
    <Dialog v-model:visible="dialog" :header="'Edit ' + $t('models.' + store.model + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-form :schema="store.route.schema" :data="data" :model="store.model" @saved="onSave" method="put"/>
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"

    const props = defineProps({
        store : Object,
        data : Object
    });

    const emits = defineEmits([
        'onSave'
    ])

    const dialog = ref(false);

    function editRow() {
        dialog.value =true;
    }

    function onSave() {
        dialog.value = false;
        emits('onSave');
    }


</script>