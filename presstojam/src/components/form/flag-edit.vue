<template>
    <Checkbox 
        v-model="value" 
        :binary="true" 
        :class="errClass"
        @blur="bind.active_validation = true">
    </Checkbox>
</template>

<script setup>
import Checkbox from 'primevue/checkbox';
import { computed, ref } from "vue"

const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
});


const checked = ref(props.bind.value);

const value = computed({
    get() {
        return (checked.value) ? true : false;
    },
    set(val) {
        props.bind.setValue(val);
        checked.value = props.bind.value;
    }
});

const errClass = computed(() => {
    return (props.bind.active_validation && props.bind.error) ? "p-invalid" : "";
});

</script>