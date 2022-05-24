<template>
 <ptj-widget title="search" v-slot="slotScope">
   <form @submit.prevent="searchData" class="ptj-filter-form">
      <ptj-form-row v-for="field in RepoStore.search.cells" :key="field.name" :field="field" v-show="field.type != 'id' || Object.keys(field.options).length > 0">
          <ptj-id v-if="field.type=='id'" type="filter" :field="field" />
          <ptj-flag v-else-if="field.type=='flag'" type="filter" :field="field" />
          <ptj-number v-else-if="field.type=='number'" type="filter" :field="field" />
          <ptj-time v-else-if="field.type=='time'" type="filter" :field="field" />
          <ptj-string v-else-if="field.type=='string'" type="filter" :field="field" />
          <a @click="field.reset()">x</a>
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
import { addToHistory } from "./../js/route.js"
import { Map } from "./../js/map.js"
import { RepoStore, loadRepo } from "./../js/repo.js"


function searchData() {
    RepoStore.search.applyChangeData();
    Map.params = RepoStore.search.convertToParams();
    addToHistory();
    loadRepo();
}


</script>
<style scoped>
.error {
  color : red;
}

</style>

