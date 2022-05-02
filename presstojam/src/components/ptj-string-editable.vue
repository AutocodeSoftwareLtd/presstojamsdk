<template>
   <textarea v-if="tag=='textarea'"
        v-bind="atts" 
        :name="field.meta.name" 
        v-model="field.val"></textarea>
   <select v-else-if="tag=='select'" 
        v-model="field.val"
        :name="field.meta.name"
        v-bind="atts"
         @blur="field.validateon = true"
        >
        <option value="0" selected disabled>Select Option</option>
        <option v-for="option in options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <input v-else v-bind="atts"
        :name="field.meta.name"
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly" />
</template>

<script setup>

import { computed } from "vue"
const props = defineProps({
    field : Object
});



console.log(props.field.val);

function isEnum(contains) {
        if (!contains) return null;
        let enums=[];
        const regEx = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9._]+$/);
        const exps = contains.split("|");
        for(let exp of exps) {
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
    if (isEnum(props.field.meta.validator.contains)) {
        return "select";
    } else if (props.field.meta.html || props.field.meta.max > 150) {
        return "textarea";
    } else {
        return "input";
    }
});

const options = computed(() => {
    const exps = props.field.meta.validator.contains.split("|");
    let options = [];
    for(let exp of exps) {
        options.push({ key : exp, value : exp});
    }
    return options;
});

const atts = computed(() => {
    let atts = {};
    if (props.field.meta.encrypted) {
        atts.type = "password";
    }

    if (props.field.meta.readonly) {
        atts.readonly = true;
    }

    if (props.field.meta.placeholder) {
        atts.placeholder = field.meta.placeholder;
    }

    if (props.field.meta.html) {
        atts["data-html"] = 1;
    }
    return atts;
});
</script>
