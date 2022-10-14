<template>
    <Password v-if="bind.cell.encrypted" v-model="value" class="focus:border-primary"/>
   <Textarea v-else-if="tag=='textarea'" v-model="value" rows="5" />
  <Dropdown v-else-if="tag=='select'" 
        v-model="value"
        :name="bind.cell.name"
        v-bind="atts"
        optionLabel="value"
        optionValue="key"
        :options="options"
        placeholder="Please Select"
        class="focus:border-primary"
         @blur="bind.active_validation.value = true"
        >
  </Dropdown>
  <InputText v-else v-bind="atts"
        :name="bind.cell.name"
        class="focus:border-primary form-control"
        v-model="value" 
        @blur="bind.active_validation.value = true" />
</template>

<script setup>
import { ref, computed } from "vue"
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea';
import { useI18n } from 'vue-i18n';


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
const options = ref([]);
const { te, t } = useI18n();


const tag = computed(() => {
if (cell.isEnum()) {
    options.value = cell.getOptions();
    return "select";
} else if (cell.encrypted) {
    return "input";
} else if (cell.html || cell.max > 300) {
    return "textarea";
} else {
    return "input";
}
});



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


</script>
