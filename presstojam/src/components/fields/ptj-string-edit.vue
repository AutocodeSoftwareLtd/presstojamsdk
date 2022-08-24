<template>
   <div v-if="field.encrypted">
       <label>{{ getDictionary(field.model + "-" + field.name) }}</label><Password v-model="modelValue" />
       <label>{{ getDictionary(field.model + "-" + field.name + "-confirm") }}</label><Password v-model="modelValue" />
   </div>
   <textarea v-if="tag=='textarea'"
        v-bind="atts" 
        :name="field.name" 
        v-model="store.active[field.name]"></textarea>
  <Dropdown v-else-if="tag=='select'" 
        v-model="store.active[field.name]"
        :name="field.name"
        v-bind="atts"
        optionLabel="value"
        optionValue="key"
        :options="options"
         @blur="field.validateon = true"
        >
  </Dropdown>
  <InputText v-else v-bind="atts"
        :name="field.name"
        v-model="store.active[field.name]" 
        @blur="field.validateon = true" />
</template>

<script setup>
import { ref, inject } from "vue"
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext'
import { getDictionary } from "./../../js/dictionary.js"


import { computed } from "vue"

const field = inject("cell");
const store = inject("store");

const options = ref([]);



const tag = computed(() => {
if (field.isEnum()) {
    field.setContainsAsOptions(options);
    return "select";
} else if (field.encrypted) {
    return "input";
} else if (field.html || field.max > 300) {
    return "textarea";
} else {
    return "input";
}
});


const atts = computed(() => {
let atts = {};
if (field.encrypted) {
    atts.type = "password";
}

if (field.immutable) {
    atts.readonly = true;
}


let pholder = getDictionary('placeholder', { "model" : field.model, "field" : field.name });
if (pholder) {
    atts.placeholder = pholder;
}

if (field.contains.includes("html")) {
    atts["data-html"] = 1;
}
return atts;
});


</script>
