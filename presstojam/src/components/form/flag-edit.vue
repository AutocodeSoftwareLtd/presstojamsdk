<template>
    <Checkbox 
        v-model="value" 
        :class="bind.classes"
        :inputId="bind.cell.name"
        :binary="true"
        @blur="bind.setShowError(true)">
    </Checkbox>
</template>

<script setup>
import Checkbox from 'primevue/checkbox'
import { computed, ref } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});

const cvalue = ref(props.bind.value ? true : false);




const value = computed({
    get() {
        return cvalue.value;
    },
    set(val) {
        props.bind.value = (val) ? 1 : 0;
        cvalue.value = val;
    }
});

</script>