<template>
  <div v-if="field.isReferenceType()" class="p-component">
    <Dropdown placeholder="Please Select" :field="field" :options="options" optionValue="key" optionLabel="value" v-model="value"/>
    <ptj-reference-create :cref="cref" @onCreate="onCreate" />
  </div>
  <TreeSelect v-else-if="field.recursive" v-model="value" :options="options" placeholder="Select Item" />
  <InputNumber v-else :name="field.name" v-model="value" :disabled="true" />
  
</template>


<script setup>
import { inject, ref, onMounted, computed } from "vue"
import Dropdown from 'primevue/dropdown';
import InputNumber from "primevue/InputNumber"
import TreeSelect from 'primevue/treeselect';
import { getStoreById } from "./../../js/datastore.js"
import { getOptions, getRecursiveOptions } from "./../../js/helperfunctions.js"
import PtjReferenceCreate from "./../actions/ptj-reference-create.vue"

const props = defineProps({
    modelValue : [Number, String, Boolean],
    field : Object
});

const emits = defineEmits([
    "update:modelValue"
]);


const model = inject("model");
const store = getStoreById(model);


const options = ref([]);
let value;
let cref;

if (props.field.isReferenceType()) {
    onMounted(() => {
        getOptions(store, props.field.name)
        .then(response => options.value =response);
    });  

    value = computed({
        get() {
            return parseInt(props.modelValue);
        },
        set(val) {
            emits('update:modelValue', val);
        }
    });

   cref = store.references[props.field.name];
} else if (props.field.recursive) {
    onMounted(() => {
       getRecursiveOptions(store)
       .then(response => {
        let arr = [...response];
        arr.unshift({key : 0, value : 'Root'});
        options.value =arr;
       });
    });  

    value = computed({
        get() {
            let obj = {};
            obj[props.modelValue] = true;
            return obj;
        },
        set(val) {
            for(const i in val) {
                emits('update:modelValue', i);
            }
        }
    });
} 


function onCreate(id) {
    value = id;
    if (props.field.reference) {
        store.references[props.field.name].reload()
        .then(() => {
            return getOptions(store, props.field.name)
        }).then(response => {
            options.value =response;
        });
    }
}


</script>