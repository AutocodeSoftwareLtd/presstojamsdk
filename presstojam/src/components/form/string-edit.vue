<template>
    <Password v-if="bind.cell.encrypted" v-model="value" class="focus:border-primary" :class="errClass"/>
   <Textarea v-else-if="tag=='textarea'" v-model="value" rows="5" :class="errClass"/>
  <AutocompleteSelect v-else-if="tag=='select'" 
       :bind="bind"
       :options="options"
       :class="errClass"
        />
  <InputText v-else v-bind="atts"
        :name="bind.cell.name"
        class="focus:border-primary form-control"
        v-model="value" 
        :class="errClass"
        @blur="bind.active_validation.value = true" />
</template>

<script setup>
import { computed } from "vue"
import Password from 'primevue/password';
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea';
import { useI18n } from 'vue-i18n';
import AutocompleteSelect from "./autocomplete-select.vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});

const value = computed({
    get() {
        return props.bind.value.value;
    },
    set(val) {
        props.bind.setValue(val);
    }
});


const cell = props.bind.cell;
const { te, t } = useI18n();
let options = [];


let tag;
if (cell.isEnum()) {
    options = cell.getOptions();
    tag = "select";
} else if (cell.encrypted) {
    tag = "input";
} else if (cell.html || cell.max > 300) {
    tag = "textarea";
} else {
    tag = "input";
}



const atts = {};
if (cell.encrypted) {
    atts.type = "password";
}

if (cell.immutable) {
    atts.readonly = true;
}


let pholder = te("models." + cell.model + ".fields." + cell.name + ".placeholder");
if (pholder) {
    atts.placeholder = t("models." + cell.model + ".fields." + cell.name + ".placeholder");
}

if (cell.contains.includes("html")) {
    atts["data-html"] = 1;
}



const errClass = computed(() => {
    return (props.bind.active_validation.value && props.bind.error.value) ? "p-invalid" : "";
});
</script>
