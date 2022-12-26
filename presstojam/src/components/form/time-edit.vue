<template>
    <Calendar v-if="disabled==false" 
        id="range" v-model="value"  
        :disabledDates="bind.cell.invalid_dates"
        :manualInput="false" 
        :class="errClass"
        class="focus:border-primary" 
        dateFormat="dd/mm/yy"/>
    <span v-else>{{value }}</span>
</template>

<script setup>
import Calendar from "primevue/Calendar"
import { computed } from "vue"

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

const disabled = (props.bind.cell.system) ? true : false;

const errClass = computed(() => {
    return (props.bind.active_validation.value && props.bind.error.value) ? "p-invalid" : "";
});

</script>
