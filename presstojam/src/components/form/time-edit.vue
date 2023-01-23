<template>
    <Calendar v-if="disabled==false" 
        id="range" v-model="value"  
        :disabledDates="bind.cell.invalid_dates"
        :manualInput="false" 
        :class="bind.classes"
        class="focus:border-primary" 
        dateFormat="dd/mm/yy"
        @blur="bind.setShowError(true)"
        />
    <span v-else>{{value }}</span>
</template>

<script setup>
import Calendar from "primevue/Calendar"
import { computed, ref } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});

let cvalue = ref(props.bind.value);

const value = computed({
    get() {
        return cvalue.value;
    },
    set(val) {
        props.bind.setValue(val);
        cvalue.value = props.bind.value;
    }
});

const disabled = (props.bind.cell.system) ? true : false;

</script>
