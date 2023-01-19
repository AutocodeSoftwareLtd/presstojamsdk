<template>
    <Button icon="pi pi-pencil" class="p-button-success mr-2" label="move" @click="moveRow" :disabled="!repo.selected.value.length"/>
    <Dialog v-model:visible="dialog" :header="'Move ' + $t('models.' + store.name + '.title', 2)" :modal="true" class="p-fluid">
        <p>Moving</p>
        <ul>
            <li v-for="item in repo.selected.value">{{ getLabel(repo.fields, item) }}</li>
        </ul>
        <move-action :name="name" @onMove="onMove()" />
    </Dialog>

</template>
<script setup>
    import { ref } from "vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/button"
    import MoveAction from "../effects/move-action.vue"
    import { getStore } from "../../js/data/storemanager.js"
    import { getLabel } from "../../js/helperfunctions.js"

    const props = defineProps({
        name : {
            type : String,
            required : true
        }
    });

    const emits = defineEmits(['onMove']);

    const repo = getStore(props.name);
    const store = repo.store;

    
    const dialog = ref(false);

    function moveRow() {
        dialog.value =true;
    }

    function onMove() {
        dialog.value = false;
        emits("onMove");
    }


</script>