<template>
    <select v-if="ctype=='edit'" 
        v-model="field.change"
        v-bind="field.atts"
        :name="field.name"
         @blur="field.validateon = true"
        >
        <option value="0" selected>Select Option</option>
        <option v-for="option in field.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <ptj-multiple-select v-else-if="ctype=='filter'" :field="field" />
  <span v-else>{{ field.getOption(field.val) }}</span>
</template>


<script setup>
import { computed } from "vue"
import PtjMultipleSelect from "./ptj-multiple-select.vue"

const props = defineProps({
    field : Object,
    type : {
        default : 'view',
        type : String
    }
});


let ctype = computed(() => {
    return (props.type == 'edit' && props.field.immutable) ? "view" : props.type;
});

let options = computed(() => {
    return props.field.options;
});



</script>