<template>
    <select v-if="type=='edit'" 
        v-model="field.val"
        v-bind="field.atts"
        :name="field.name"
         @blur="field.validateon = true"
        >
        <option value="0" selected>Select Option</option>
        <option v-for="option in field.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <select v-else-if="type=='filter'"
        v-model="field.val"
        :name="field.name"
         @blur="field.validateon = true"
        v-bind="field.atts"
         multiple="true"
        >
        <option value="0" selected disabled>All</option>
        <option v-for="option in field.options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <span v-else>{{ field.val }}</span>
</template>


<script setup>
defineProps({
    field : Object,
    type : {
        default : 'view',
        type : String
    }
});



</script>