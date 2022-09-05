<template>
   <MultiSelect v-if="tag=='select'" display="chip" placeholder="Please Select" v-model="value" :options="options" optionLabel="key" optionValue="value" />
   <Chips v-model="value" v-else-if="tag=='input'"  />
</template>

<script setup>
import { ref, computed } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';

const props = defineProps({
    modelValue : [Array],
    field : Object
});


const options = ref([]);

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        let arr = [];
        if (tag == 'select') {
            arr = props.modelValue;
        } else if (props.modelValue) {
            for(let val of props.modelValue) {
                arr.push(val.replace(/^%+/, '').replace(/%+$/, ''));
            }
        }
        return arr;
    },
    set(val) {
        let arr = [];
        for(let vl of val) {
            arr.push("%" + vl + "%");
        }
        if (arr.length == 0) arr = null;
        emits('update:modelValue', arr);
    }
});

const tag = computed(() => {
if (props.field.isEnum()) {
    options.value = props.field.setContainsAsOptions();
    return "select";
} else if (props.field.encrypted) {
    return "";
} else {
    return "input";
}
});


</script>
