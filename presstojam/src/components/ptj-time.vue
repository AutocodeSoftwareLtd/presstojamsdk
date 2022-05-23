<template>
  <input v-if="ctype=='edit'"
        :name="field.name" 
        type="datetime-local" 
        v-model="field.change" 
        v-bind="field.atts"
        @blur="field.validateon = true">
   <div v-else-if="ctype=='filter'">
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
    field : Object,
    type : {
        default : 'view',
        type : String
    }
});

let ctype = computed(() => {
    return (props.type == 'edit' && props.field.immutable) ? "view" : props.type;
});
</script>
