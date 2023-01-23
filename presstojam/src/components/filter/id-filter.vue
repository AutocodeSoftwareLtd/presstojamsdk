<template>
  <MultiSelect placeholder="Please Select" v-if="field.reference || field.name =='--id'" :field="field" :options="options" optionLabel="value" optionValue="key" v-model="value" />
  <Chips v-model="value" v-else  />
</template>


<script setup>
import { ref, onMounted, inject, computed } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';
import { getModel } from "../../js/models/modelmanager.js"
import { getLabel } from "../../js/helperfunctions";

const props = defineProps({
    modelValue : [Array],
    field : Object
});


const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        if (val.length == 0) val =null;
        emits('update:modelValue', val);
    }
});

const model = inject("model");
const store = getModel(model);
const id = (store.active_id) ? store.active_id : store.parent_id;
const client = inject("client");

const options = ref([]);

if (props.field.reference || props.field.recursive) {
    onMounted(() => {
        props.field.getOptions(client, model, id)
        .then(response => options.value =response);
    });
} else if (props.field.name == '--id') {
    let vals = [];
    for(let row of store.data) {
        vals.push({'key' : row['--id'], value : getLabel(store.fields, row) });
    }
    options.value = vals;
}


</script>