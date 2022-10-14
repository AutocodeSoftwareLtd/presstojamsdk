<template>
    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="!repo.selected.value.length" @click="delRow" />
    <Dialog v-model:visible="dialog" :header="'Delete ' + $t('models.' + repo.store.model + '.title', (single) ? 1 : 2)" :modal="true" class="p-fluid">
        <p>Are you sure you want to delete:</p>
        <ul>
            <li v-for="item in repo.selected.value">{{ getLabel(repo.store.route.schema, item) }}</li>
        </ul>
        <p>Type <i>{{ check_str }}</i> in the box below</p>
        <div class="p-inputgroup">
            <InputText :placeholder="check_str" v-model="delval"/>
            <Button label="Delete" :disabled="disabled" icon="pi pi-trash" @click="del" class="p-button-danger">Delete</Button>
        </div>
    </Dialog>

</template>
<script setup>
    import { ref, computed } from "vue"
    import Dialog from 'primevue/dialog'
    import Button from "primevue/Button"
    import { getStore } from "./../../js/reactivestores.js"
    import client from "./../../js/client.js"
    import InputText from 'primevue/inputtext';
    import { getLabel } from "./../../js/helperfunctions.js"

    const props = defineProps({
        name : String,
        single : false
    });

    const emits = defineEmits([
        "onDel"
    ]);

    const repo = getStore(props.name);
    const check_str = "delete";

    const dialog = ref(false);

    function delRow() {
        dialog.value =true;
    }


    let delval = ref("");

    const disabled = computed(() => {
        return (delval.value == check_str) ? false : true;
    })


    function del() {
        let params = {};
        if (props.data.length > 1) {
            const keys = [];
            for(const row of props.data) {
                keys.push(row.key);
            }
            params["--id"] = keys;
        } else {
            params["--id"] = props.data[0].key;
        }


        client.delete("/data/" +repo.store.model, params)
        .then(() => {
            dialog.value = false;
            emits("onDel");
        })
        .catch(e => console.log(e));
    }
    

</script>