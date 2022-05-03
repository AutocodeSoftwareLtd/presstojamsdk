<template>
  <input v-if="type=='edit'"
        :name="field.name" 
        type="datetime-local" 
        v-model="field.val" 
        v-bind="field.atts"
        @blur="field.validateon = true">
   <div v-else-if="type=='filter'">
      <input 
        type="datetime-local" 
        :name="field.name + 'min'"
        v-bind="field.atts"
        v-model="field.val1">
        -
        <input 
            type="datetime-local" 
            :name="field.name + 'max'"
            v-bind="field.atts"
            v-model="field.val2"
        >
   </div>
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
