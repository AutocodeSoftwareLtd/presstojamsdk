<template>
   <MultiSelect v-if="tag=='select'" display="chip" v-model="value" :options="options" optionLabel="key" optionValue="value" />
   <Chips v-model="value" v-else-if="tag=='input'"  />
</template>

<script setup>
import { ref, computed } from "vue"
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';

const props = defineProps({
    modelValue : [Number, Boolean],
    field : Object
});


const options = ref([]);

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

const tag = computed(() => {
if (props.field.isEnum()) {
    props.field.setContainsAsOptions(options);
    return "select";
} else if (props.field.encrypted) {
    return "";
} else {
    return "input";
}
});


</script>
