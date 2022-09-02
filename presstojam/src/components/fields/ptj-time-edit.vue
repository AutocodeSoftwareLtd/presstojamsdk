<template>
    <Calendar v-if="disabled==false" id="range" v-model="value" :manualInput="true" v-bind="atts" class="focus:border-primary"/>
    <span v-else>{{value }}</span>
</template>

<script setup>
import Calendar from "primevue/Calendar"
import { computed } from "vue"

const props = defineProps({
    modelValue : [Number, String],
    field : Object
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

const disabled = (props.field.system) ? true : false;

</script>
