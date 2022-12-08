<template>
  <div v-if="bind.cell.isReferenceType()" class="p-inputgroup">
    <AutocompleteSelect :bind="bind" :options="options" optionValue="--key" optionLabel="--value"/>
    <span class="p-inputgroup-addon">
        <i class="pi pi-plus" @click="dialog='true'" style="cursor:pointer;"></i>
    </span>
    <Dialog v-model:visible="dialog" :header="'Create ' + $t('models.' + cell.reference + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-reference-create :cell="bind.cell" :store="store"  />
    </Dialog>
  </div>
  <TreeSelect v-else-if="bind.cell.recursive" v-model="value" :options="options" placeholder="Select Item" />
  <InputNumber v-else :name="bind.cell.name" v-model="value" :disabled="true" />
  
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import InputNumber from "primevue/inputnumber"
import TreeSelect from 'primevue/treeselect';
import { getStoreById } from "../../js/datastore.js"
import { getStore } from "../../js/reactivestores.js"
import PtjReferenceCreate from "../actions/reference-create.vue"
import Dialog from 'primevue/dialog'
import AutocompleteSelect from "./autocomplete-select.vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});


const model = inject("model");
const store = getStoreById(model);
const client = inject("client");

const dialog = ref(false);



const options = ref([]);
let value;
let id = 0;

if (store.active_id) {
    const repo = getStore(model);
    id = repo.data.value['--parent'];
} else {
    id = store.parent_id;
}

const cell = props.bind.cell;

if (cell.isReferenceType()) {
    onMounted(() => {
        cell.getOptions(client, model, id)
        .then(response => options.value =response)
        .catch(e => console.log(e));
    });  

    value = computed({
        get() {
            return props.bind.value.value;
        },
        set(val) {
            props.bind.setValue(val);
        }
    });

} else if (cell.recursive) {
    onMounted(() => {
       cell.getRecursiveOptions(client, model, id, store.route.schema)
       .then(response => {
        let arr = [...response];
        arr.unshift({key : 0, value : 'Root'});
        options.value =arr;
       })
       .catch(e => console.log(e));
    });  

    value = computed({
        get() {
            let obj = {};
            obj[props.bind.value.value] = true;
            return obj;
        },
        set(val) {
            const keys = Object.keys(val);
            props.bind.setValue(keys[0]);
        }
    });
} 


function onCreate(id) {
    value = id;
    if (cell.reference) {
        store.references[cell.name].reload()
        .then(() => {
            return getOptions(store, cell.name)
        }).then(response => {
            options.value =response;
        });
    }
}


</script>