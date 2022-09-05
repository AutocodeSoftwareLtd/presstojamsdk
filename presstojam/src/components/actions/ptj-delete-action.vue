<template>
    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="!data || !data.length" @click="delRow" />
    <Dialog v-model:visible="dialog" :style="{width: '450px'}" :header="model" :modal="true" class="p-fluid">
        <ptj-delete :data="data" :model="model" />
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
    });

    const dialog = ref(false);

    function delRow() {
        dialog.value =true;
    }

</script>