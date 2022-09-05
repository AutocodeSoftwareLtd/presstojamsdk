<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow" />
    <Dialog v-model:visible="dialog" :style="{width: '450px'}" :header="model" :modal="true" class="p-fluid">
        <ptj-form :model="model" :store="store" />
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"

    const props = defineProps({
        store : Object,
        data : Object,
        model : String
    });

    const dialog = ref(false);

    function editRow() {
        props.store.active = { ...props.data };
        dialog.value =true;
    }
</script>