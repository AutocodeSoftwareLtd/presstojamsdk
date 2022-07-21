<template>
  <input v-if="field.mode=='edit' || field.mode == 'post'"
        :name="field.name" 
        type="datetime-local" 
        v-model="field.change" 
        v-bind="field.atts"
        @blur="field.validateon = true">
   <div v-else-if="field.mode=='filter'">
      <input 
        type="datetime-local" 
        :name="field.name + 'min'"
        v-bind="field.atts"
        v-model="field.change1">
        -
        <input 
            type="datetime-local" 
            :name="field.name + 'max'"
            v-bind="field.atts"
            v-model="field.change2"
        >
   </div>
   <span v-else>{{ field.val }}</span>
</template>

<script setup>
import { computed } from "vue"
const props = defineProps({
    field : Object
});

</script>
