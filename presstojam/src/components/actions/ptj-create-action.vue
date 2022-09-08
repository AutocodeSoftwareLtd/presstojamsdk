<template>
    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="createRow" />
    <Dialog v-model:visible="dialog" :header="header" :modal="true" class="p-fluid">
        <ptj-form :store="store" @saved="onSave" />
    </Dialog>

</template>
<script setup>
    import { ref, } from "vue"
    import PtjForm from "./../ptj-form.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"
    import { useI18n } from 'vue-i18n'
    import { getLabel } from "./../../js/helperfunctions.js"

    const {t} = useI18n({});

    const props = defineProps({
        store : Object
    });

    const emits = defineEmits([
        'onSave'
    ])

    const dialog = ref(false);

    let parentlabel = "";
    if (props.store.parent_store) {
        let parent_id = props.store.getParentID();
        if (!parent_id) {
            throw "Error, parent id required to add append child row";
        }
      
        parentlabel = getLabel(props.store.parent_store.route.schema, props.store.parent_store.active.value);
        if (!parentlabel) parentlabel = parent_id;
    }
    

    const header = (props.store.parent_store) 
        ? "Add " + t("models." + props.store.model + ".title", 1) + " to " + parentlabel  
        : "Create " + t("models." + props.store.model + ".title", 1);

    function createRow() {
        props.store.active.value = {};
        if (props.store.parent_store) props.store.active.value['--parentid'] = props.store.getParentID();
        dialog.value =true;
    }

    function onSave() {
        dialog.value = false;
        emits('onSave');
    }
</script>