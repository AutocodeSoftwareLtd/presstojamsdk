<template>
  <div v-if="bind.cell.isReferenceType()" class="p-inputgroup">
    <AutocompleteSelect :bind="bind" :options="options" />
    <span class="p-inputgroup-addon" v-if="store.perms.includes('post')">
        <reference-action :name="bind.cell.reference" :model="store" />
    </span>
  </div>
  <TreeSelect v-else-if="bind.cell.recursive" v-model="value" :options="options" placeholder="Select Item" @blur="bind.setShowError(true)"/>
  <InputNumber v-else :name="bind.cell.name" v-model="value" :disabled="true" @blur="bind.setShowError(true)"/>
  
</template>


<script setup>
import { inject, ref, computed } from "vue"
import InputNumber from "primevue/inputnumber"
import TreeSelect from 'primevue/treeselect';
import ReferenceAction from "../actions/reference-action.vue"
import AutocompleteSelect from "./autocomplete-select.vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    },
    data : Object
});

const store = inject("model");

const options = ref([]);


let obj = {};

if (props.bind.cell.multiple) {
    for(const i in props.bind.value) {
        obj[i] = true;
    }
} else {
    obj[props.bind.value] = true;
}
let cvalue = ref(obj);
let value;



const parent_id =(props.data['--parent']) ? props.data["--parent"] : 0;

const cell = props.bind.cell;


if (cell.isReferenceType()) {
        store.getOptions(cell.name, parent_id)
        .then(response => {
            let arr = [...response];
            arr.unshift({value:0,label:"None"})
            options.value = arr;
        })
        .catch(e => console.log(e));
    

    value = computed({
        get() {
            return cvalue.value;
        },
        set(val) {
            props.bind.setValue(val);
            cvalue.value = val;
        }
    });

} else if (cell.recursive) {
      store.getRecursiveOptions(cell.name, parent_id)
       .then(response => {
        let arr = [...response];
        arr.unshift({key : "0", label : 'None' , "--recursive" : 0});
        options.value =arr;
       })
       .catch(e => console.log(e));

    value = computed({
        get() {
            return cvalue.value;
        },
        set(val) {
            const keys = Object.keys(val);
            props.bind.setValue(keys[0]);
            cvalue.value= val;
        }
    });
} 


</script>