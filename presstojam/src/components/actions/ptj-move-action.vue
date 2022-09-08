<template>
    <Button icon="pi pi-pencil" class="p-button-success mr-2" label="move" @click="moveRow" :disabled="!store.selected.value || !store.selected.value.length"/>
    <Dialog v-model:visible="dialog" :header="'Move ' + $t('models.' + model + '.title', 2)" :modal="true" class="p-fluid">
        <ptj-move :model="model" :store="store" @onMove="onMove" />
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import PtjMove from "./../ptj-recursive-move.vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"

    const props = defineProps({
        store : Object,
        model : String,
    });

    const emits = defineEmits(['onParentChanged']);

    const dialog = ref(false);

    function moveRow() {
        dialog.value =true;
    }

    function onMove() {
        dialog.value = false;
        emits("onParentChanged");
    }


</script>