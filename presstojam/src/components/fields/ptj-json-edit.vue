<template>
   <Fieldset :legend="$t('models.' + bind.cell.model + '.fields.' + bind.cell.name + '.label')">
    <div class="field form-group" v-for="jbind in binds" :key="jbind.cell.name">
        <label :for="jbind.cell.name">{{ $t("models." + jbind.cell.model + ".fields." + jbind.cell.name + ".label") }}</label>
        <ptj-edit-field :bind="jbind" />
        <ptj-error :field="jbind.cell" v-if="jbind.active_validation && jbind.error" :error="jbind.error" />
    </div>
   </Fieldset>
</template>

<script setup>
import Fieldset from 'primevue/fieldset';
import PtjEditField from "./../ptj-edit-field.vue"
import PtjError from "./../ptj-error.vue"
import { computed } from "vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});


const binds = computed(() => {
    const arr = [];
    for(let i in props.bind.children.binds) {
        if (props.bind.children.binds[i].active.value) {
            arr.push(props.bind.children.binds[i]);
        } 
    }
    return arr;
});

</script>
