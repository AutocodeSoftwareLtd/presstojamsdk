<template>
  <input v-if="type=='edit' || type=='post'"
        class="ptj-form-number" 
        :name="field.name" 
        type="number" 
        v-model="field.change" 
        v-bind="atts"
        @blur="field.validateon = true" >
   <div v-else-if="type=='filter'">
       <input
        class="ptj-form-filter-number ptj-min" 
        :name="field.name" 
        type="number" 
        v-model="field.change1" 
        v-bind="atts"
        @blur="field.validateon = true"> - 
        <input
        class="ptj-form-filter-number ptj-max" 
        :name="field.name" 
        type="number" 
        v-model="field.change2" 
        v-bind="atts"
        @blur="field.validateon = true">
   </div>
   <span v-else>{{ field.val }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    field : Object,
    type : {
        type : String,
        default : 'view'
    }
});


const atts = computed(() => {
    let atts = {};
    if (props.field.meta.round) {
        let step = "0.";
        for(let i=0; i<props.field.meta.round - 1; ++i) {
            step += "0";
        }
        step += "1";
        atts["step"]  = step;
    }
    return atts;
});
</script>
