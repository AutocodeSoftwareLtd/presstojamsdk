<template>
    <input class="ptj-checkbox" type="checkbox" :true-value="1" :false-value="0" :name="field.name" v-model="field.val" v-if="type=='edit'">
    <select v-else-if="type=='filter'" :name="field.name" v-model="field.val" class="ptj-filter-form-checkbox">
        <option :value='0'>{{ "All" }}</option>
        <option :value='1'>{{ "Checked" }}</option>
        <option :value='2'>{{ "Unchecked" }}</option>
    </select>
    <button v-else>{{ field.val }}</button>
</template>

<script setup>
defineProps({
    field : Object,
    type : {
        type : String,
        default : 'view'
    }
});
</script>