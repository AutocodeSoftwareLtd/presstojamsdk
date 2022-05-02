<template>
  <ptj-string-editable v-if="type =='edit'" :field="field" />
  <ptj-string-filter v-else-if="type=='filter'" :field="field" />
  <ptj-string-display v-else :field="field" />
</template>

<script setup>
import PtjStringEditable from "./ptj-string-editable.vue"
import PtjStringDisplay from "./ptj-string-display.vue"
import PtjStringFilter from "./ptj-string-filter.vue"

const props = defineProps({
    field : {
        type : Object,
        required : true
    },
    type : {
        type : String,
        default : 'view'
    }
});


</script>
