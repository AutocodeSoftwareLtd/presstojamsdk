<template>
  <div v-if="bind.cell.isReferenceType()" class="p-inputgroup">
    <AutocompleteSelect :bind="bind" :options="options" />
    <span class="p-inputgroup-addon">
        <i class="pi pi-plus" @click="dialog='true'" style="cursor:pointer;"></i>
    </span>
    <Dialog v-model:visible="dialog" :header="'Create ' + $t('models.' + cell.reference + '.title', 1)" :modal="true" class="p-fluid">
        <ptj-reference-create :cell="bind.cell" :store="store"  />
    </Dialog>
  </div>
  <TreeSelect v-else-if="bind.cell.recursive" v-model="value" :options="options" placeholder="Select Item" @blur="bind.setShowError(true)"/>
  <InputNumber v-else :name="bind.cell.name" v-model="value" :disabled="true" @blur="bind.setShowError(true)"/>
  
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import InputNumber from "primevue/inputnumber"
import TreeSelect from 'primevue/treeselect';
import { getModel } from "../../js/models/modelmanager.js"
import PtjReferenceCreate from "../actions/reference-create.vue"
import Dialog from 'primevue/dialog'
import AutocompleteSelect from "./autocomplete-select.vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    },
    data : Object
});

const store = inject("model");

const client = inject("client");

const dialog = ref(false);



const options = ref([]);
let value;

const parent_id =(props.data['--parent']) ? props.data["--parent"] : 0;

const cell = props.bind.cell;



if (cell.isReferenceType()) {
        cell.getOptions(client, model, parent_id)
        .then(response => {
            let arr = [...response];
            arr.unshift({value:0,label:"None"})
            options.value = arr;
        })
        .catch(e => console.log(e));
    

    value = computed({
        get() {
            return props.bind.value;
        },
        set(val) {
            props.bind.setValue(val);
        }
    });

} else if (cell.recursive) {
       cell.getRecursiveOptions(client, model, parent_id, store.fields)
       .then(response => {
        let arr = [...response];
        arr.unshift({key : "0", label : 'None' , "--recursive" : 0});
        options.value =arr;
       })
       .catch(e => console.log(e));

    value = computed({
        get() {
            let obj = {};
            obj[props.bind.value] = true;
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