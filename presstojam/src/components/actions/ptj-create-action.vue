<template>
    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="createRow" />
    <Dialog v-model:visible="dialog" :header="header" :modal="true" class="p-fluid">
        <ptj-form :schema="store.route.schema" :model="store.model" :data="data" @saved="onSave" @dataChanged="dataChanged"/>
    </Dialog>

</template>
<script setup>
    import { ref, } from "vue"
    import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"
    import { useI18n } from 'vue-i18n'
    import { getStore } from "./../../js/reactivestores.js"
  

    const {t} = useI18n({});

    const props = defineProps({
       name : String,
       parentlabel : String
    });

    const repo = getStore(props.name);
    const store = repo.store;

    const emits = defineEmits([
        'onSave', 'dataChanged'
    ])

    const dialog = ref(false);

    const data = {};
    if (store.parent_id) data["--parent"] = store.parent_id;

    const header = (store.parent_store) 
        ? "Add " + t("models." + store.model + ".title", 1) + " to " + props.parentlabel  
        : "Create " + t("models." + store.model + ".title", 1);

    function createRow() {
        dialog.value =true;
    }

    function onSave() {
        dialog.value = false;
        emits('onSave');
    }


    function dataChanged(obj) {
        emits('dataChanged', obj);
    }
</script>