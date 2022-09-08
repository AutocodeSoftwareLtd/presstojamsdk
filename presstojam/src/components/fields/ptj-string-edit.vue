<template>
    <Password v-if="field.encrypted" v-model="modelValue" class="focus:border-primary"/>
   <Textarea v-else-if="tag=='textarea'" v-model="value" rows="5" />
  <Dropdown v-else-if="tag=='select'" 
        v-model="value"
        :name="field.name"
        v-bind="atts"
        optionLabel="value"
        optionValue="key"
        :options="options"
        placeholder="Please Select"
        class="focus:border-primary"
         @blur="field.validateon = true"
        >
  </Dropdown>
  <InputText v-else v-bind="atts"
        :name="field.name"
        class="focus:border-primary form-control"
        v-model="value" 
        @blur="field.validateon = true" />
</template>

<script setup>
import { ref } from "vue"
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea';
import { useI18n } from 'vue-i18n';


import { computed } from "vue"

const props = defineProps({
    modelValue : [String],
    field : {
        type : Object,
        required : true
    }
});

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


const options = ref([]);

const { te, t } = useI18n();


const tag = computed(() => {
if (props.field.isEnum()) {
    options.value = props.field.setContainsAsOptions();
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

if (props.field.immutable) {
    atts.readonly = true;
}


let pholder = te("models." + props.field.model + ".fields." + props.field.name + ".placeholder");
if (pholder) {
    atts.placeholder = t("models." + props.field.model + ".fields." + props.field.name + ".placeholder");
}

if (props.field.contains.includes("html")) {
    atts["data-html"] = 1;
}
return atts;
});


</script>
