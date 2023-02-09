<template>
   <Fieldset :legend="$t('models.' + bind.cell.model + '.fields.' + bind.cell.name + '.label')">
    <div class="field form-group" v-for="jbind in binds" :key="jbind.cell.name">
        <ptj-edit-field :bind="jbind" :active_validation="active_validation" :data="bind.cell.clean(data)"/>
    </div>
   </Fieldset>
</template>

<script setup>
import Fieldset from 'primevue/fieldset';
import PtjEditField from "./edit-field.vue"
import { computed } from "vue"


const props = defineProps({
    bind : {
        type : Object,
        required : true
    },
    active_validation : Boolean,
    data : Object
});

let group = props.bind.getGroup();



const binds = computed(() => {
    const arr = [];
    for(let i in props.bind.cell.fields) {
        const gbind = group.getBind(props.bind.cell.name + "-" + i);
        if (gbind.active.value) {
            arr.push(gbind);
        } 
    }
    return arr;
});

</script>
