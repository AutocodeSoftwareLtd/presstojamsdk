<template>
    <input type="text"
        :name="field.name"
        v-model="val" 
        @blur="store.validateon = true" />
</template>
<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
    field : {
        type : Object,
        required : true
    }
});

const store = reactive({ validateon : false, val : ''});

const val = computed({
    get() {
        return store.val;
    },
    set(val) {
        if (val != field.val) {

        }
        store.val = val;
    }
});
</script>
