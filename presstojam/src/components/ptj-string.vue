<template>
   <textarea v-if="tag=='textarea' && ctype=='edit'"
        v-bind="atts" 
        :name="field.name" 
        v-model="field.change"></textarea>
   <div v-else-if="tag=='textarea' && ctype=='view'">{{ field.val }}</div>
   <ptj-multiple-select v-else-if="tag=='select' && ctype == 'filter'" :field="field" />
  <select v-else-if="tag=='select' && ctype=='edit'" 
        v-model="field.change"
        :name="field.name"
        v-bind="atts"
         @blur="field.validateon = true"
        >
        <option value="" selected disabled>{{ getDictionary('ptj-string-default') }}</option>
        <option v-for="option in field.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <input v-else-if="ctype=='edit'" v-bind="atts"
        :name="field.name"
        v-model="field.change" 
        @blur="field.validateon = true" />
   <ptj-multiple-input :field="field" v-else-if="ctype=='filter'"/>
  <span v-else-if="ctype=='view' && field.reference">
    <ptj-button :route="{model : field.reference, key : field.val, state:'primary' }">{{ field.val }}</ptj-button>
  </span>
  <span v-else>{{ field.val }}</span>
</template>

<script setup>
import PtjButton from "./ptj-button.vue"
import PtjMultipleInput from "./ptj-multiple-input.vue"
import PtjMultipleSelect from "./ptj-multiple-select.vue"
import { getDictionary } from "./../js/dictionary.js"

import { computed } from "vue"
const props = defineProps({
    field : {
        type : Object,
        required : true
    },
    type : {
        type : String,
        default : 'view'
    }
});

let ctype = computed(() => {
    return (props.type == 'edit' && props.field.immutable) ? "view" : props.type;
});

function isEnum(contains) {
    if (contains.length == 0) return null;
    let enums=[];
    const regEx = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9._]+$/);
    for(let exp of contains) {
        if (!exp) continue;
        if (regEx.test(exp)) {
            enums.push(exp);
        } else {
            return null;
        }
    }
    return enums;
}

const tag = computed(() => {
if (isEnum(props.field.contains)) {
    props.field.setContainsAsOptions();
    return "select";
} else if (props.field.encrypted) {
    return "input";
} else if (props.field.html || props.field.max > 300) {
    return "textarea";
} else {
    return "input";
}
});


const atts = computed(() => {
let atts = {};
if (props.field.encrypted) {
    atts.type = "password";
}

if (props.field.atts.readonly) {
    atts.readonly = true;
}

if (props.field.atts.placeholder) {
    atts.placeholder = field.meta.placeholder;
}

if (props.field.atts.html) {
    atts["data-html"] = 1;
}
return atts;
});


</script>
