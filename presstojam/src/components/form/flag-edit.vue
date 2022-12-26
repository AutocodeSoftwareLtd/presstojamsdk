<template>
    <Checkbox 
        v-model="value" 
        :binary="true" 
        :class="errClass"
        @blur="bind.active_validation.value = true">
    </Checkbox>
</template>

<script setup>
import Checkbox from 'primevue/checkbox';
import { computed } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});


const value = computed({
    get() {
        return (props.bind.value.value) ? true : false;
    },
    set(val) {
        props.bind.setValue(val);
    }
});

const errClass = computed(() => {
    return (props.bind.active_validation.value && props.bind.error.value) ? "p-invalid" : "";
});

</script>