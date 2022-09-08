<template>
    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="!data || !data.length" @click="delRow" />
    <Dialog v-model:visible="dialog" :header="'Delete ' + $t('models.' + model + '.title', (single) ? 1 : 2)" :modal="true" class="p-fluid">
        <ptj-delete :data="data" :model="model" @onDel="onDel" />
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import PtjDelete from "./../ptj-delete.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"

    const props = defineProps({
        data : Array,
        model : String,
        single : false
    });

    const emits = defineEmits([
        "onDel"
    ]);

    const dialog = ref(false);

    function delRow() {
        dialog.value =true;
    }

    function onDel() {
        dialog.value = false;
        emits("onDel");
    }

</script>