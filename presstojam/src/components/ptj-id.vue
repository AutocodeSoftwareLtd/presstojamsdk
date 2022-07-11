<template>
    <select v-if="field.mode=='edit' || field.mode == 'post'" 
        v-model="field.change"
        v-bind="field.atts"
        :name="field.name"
         @blur="field.validateon = true"
        >
        <option value="0" selected>{{ getDictionary('ptj-id-default') }}</option>
        <option v-for="option in options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <ptj-multiple-select v-else-if="field.mode=='filter'" :field="field" :options="options" />
  <span v-else>{{ field.display }}</span>
</template>


<script setup>
import { computed, ref, onMounted } from "vue"
import PtjMultipleSelect from "./ptj-multiple-select.vue"
import { getDictionary } from "./../js/dictionary.js"
import { Map } from "./../js/map.js"

const props = defineProps({
    field : Object,
    parent : Number
});

const options = ref([]);

let ctype = computed(() => {
    return (props.type == 'edit' && props.field.immutable) ? "view" : props.type;
});

async function getOptions() {
    let url = "/reference/" + Map.model + "/";
    url += (props.field.meta.reference) ? props.field.name : "id";
    options.value = await props.field.meta.setReferenceOptions(
        url, 
        {"--parentid":props.parent}
    );
}


if (props.field.meta.reference || props.field.meta.recursive) {
    onMounted(() => {
       getOptions();
    });
    
}


</script>