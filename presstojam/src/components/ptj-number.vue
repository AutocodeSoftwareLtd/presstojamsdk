<template>
  <input v-if="type=='edit'"
        class="ptj-form-number" 
        :name="field.name" 
        type="number" 
        v-model="field.val" 
        v-bind="field.atts"
        @blur="field.validateon = true" >
   <div v-else-if="type=='filter'">
       <input
        class="ptj-form-filter-number ptj-min" 
        :name="field.name" 
        type="number" 
        v-model="field.val" 
        v-bind="field.atts"
        @blur="field.validateon = true"> - 
        <input
        class="ptj-form-filter-number ptj-max" 
        :name="field.name" 
        type="number" 
        v-model="field.val" 
        v-bind="field.atts"
        @blur="field.validateon = true">
   </div>
   <span v-else>{{ field.val }}</span>
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
