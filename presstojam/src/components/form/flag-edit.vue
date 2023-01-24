<template>
    <Checkbox 
        v-model="value" 
        :binary="true" 
        :class="bind.classes"
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

</script>