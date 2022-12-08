<template>
   <Fieldset :legend="$t('models.' + bind.cell.model + '.fields.' + bind.cell.name + '.label')">
    <div class="field form-group" v-for="jbind in binds" :key="jbind.cell.name">
        <ptj-edit-field :bind="jbind" />
    </div>
   </Fieldset>
</template>

<script setup>
import Fieldset from 'primevue/fieldset';
import PtjEditField from "./edit-field.vue"
import PtjError from "./error.vue"
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
