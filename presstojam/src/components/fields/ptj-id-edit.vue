<template>
  <div v-if="bind.cell.isReferenceType()" class="p-component">
    <Dropdown placeholder="Please Select" :field="bind.cell" :options="options" optionValue="key" optionLabel="value" v-model="value"/>
    <ptj-reference-create :cell="bind.cell" :store="store" @onCreate="onCreate" />
  </div>
  <TreeSelect v-else-if="bind.cell.recursive" v-model="value" :options="options" placeholder="Select Item" />
  <InputNumber v-else :name="bind.cell.name" v-model="value" :disabled="true" />
  
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import Dropdown from 'primevue/dropdown';
import InputNumber from "primevue/InputNumber"
import TreeSelect from 'primevue/treeselect';
import { getStoreById } from "./../../js/datastore.js"
import PtjReferenceCreate from "./../actions/ptj-reference-create.vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});


const model = inject("model");
const store = getStoreById(model);


const options = ref([]);
let value;
const id = (store.active_id) ? store.active_id : store.parent_id;

const cell = props.bind.cell;

if (cell.isReferenceType()) {
    onMounted(() => {
        cell.getOptions(model, id)
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
       cell.getRecursiveOptions(model, id, store.route.schema)
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