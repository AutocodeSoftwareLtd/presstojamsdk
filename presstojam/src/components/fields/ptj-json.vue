<template>
   <div v-if="field.fields.length > 0">
      <div v-for="field in field.fields" :key="field.name" >
         <label>{{ $t("models." + field.model + ".fields." + field.name + ".label") }}</label>
         <ptj-view-field :field="field" :value="jsonVal[field.name]" />
      </div>
   </div>
   <div v-else>
      <div v-for="(value, field) in jsonVal" :key="field" >
         <span>{{ field }}: </span>
         <span>{{ value }}</span>
      </div>
   </div>


</template>

<script setup>
import PtjViewField from "./../ptj-view-field.vue"

const props = defineProps({
    value : [Object, String],
    field : Object
});


const jsonVal = props.field.clean(props.value);


</script>
