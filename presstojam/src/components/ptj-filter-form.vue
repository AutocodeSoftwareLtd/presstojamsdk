<template>
 <ptj-widget title="search" v-slot="slotScope">
   <form @submit.prevent="$emit('reload')" class="ptj-filter-form">
      <ptj-form-row v-for="field in meta.cells" :key="field.name" :field="field">
          <ptj-id v-if="field.type=='id'" type="filter" :field="field" />
          <ptj-flag v-else-if="field.type=='flag'" type="filter" :field="field" />
          <ptj-number v-else-if="field.type=='number'" type="filter" :field="field" />
          <ptj-time v-else-if="field.type=='time'" type="filter" :field="field" />
          <ptj-string v-else-if="field.type=='string'" type="filter" :field="field" />
      </ptj-form-row>
      <input type="submit" value="Submit" class="ptj-filter-form-submit" @click="slotScope.toggleWidget">
  </form>
 </ptj-widget>
</template>

<script setup>

import PtjFormRow from "./ptj-form-row.vue"
import PtjId from "./ptj-id.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjTime from "./ptj-time.vue"
import PtjNumber from "./ptj-number.vue"
import PtjString from "./ptj-string.vue"
import PtjWidget from "./ptj-widget.vue"

const props = defineProps({
    meta : Object
});

</script>
<style scoped>
.error {
  color : red;
}

</style>

