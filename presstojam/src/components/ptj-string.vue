<template>
   <textarea v-if="tag=='textarea' && type=='edit'"
        v-bind="atts" 
        :name="field.name" 
        v-model="field.val"></textarea>
   <div v-else-if="tag=='textarea' && type=='view'">{{ field.val }}</div>
   <select v-else-if="tag=='select' && (type=='edit' || type == 'filter')" 
        v-model="field.val"
        :name="field.name"
        v-bind="atts"
         @blur="field.validateon = true"
        >
        <option value="0" selected disabled>Select Option</option>
        <option v-for="option in options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <input v-else-if="type=='edit' || type == 'filter'" v-bind="atts"
        :name="field.name"
        v-model="field.val" 
        @blur="field.validateon = true" />
  <span v-else-if="type=='view' && field.reference">
    <ptj-button :route="{model : field.reference, key : field.val, state:'primary' }">{{ field.val }}</ptj-button>
  </span>
  <span v-else>{{ field.val }}</span>
</template>

<script setup>
import PtjButton from "./ptj-button.vue"

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
    return "select";
} else if (props.field.html || props.field.max > 150) {
    return "textarea";
} else {
    return "input";
}
});

const options = computed(() => {
let options = [];
for(let exp of props.field.contains) {
    options.push({ key : exp, value : exp});
}
return options;
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
