<template>
   <form @submit.prevent="searchData" class="ptj-filter-form">
      <h3>{{ getDictionary('ptj-filter-form-title')}}</h3>
      <ptj-form-row v-for="field in RepoStore.search.cells" :key="field.name" :field="field" v-show="field.type != 'id' || field.meta.reference || field.meta.recursive">
          <ptj-id v-if="field.type=='id'" type="filter" :field="field" :parent="Map.key"/>
          <ptj-flag v-else-if="field.type=='flag'" type="filter" :field="field" />
          <ptj-number v-else-if="field.type=='number'" type="filter" :field="field" />
          <ptj-time v-else-if="field.type=='time'" type="filter" :field="field" />
          <ptj-string v-else-if="field.type=='string'" type="filter" :field="field" />
          <a class="ptj-filter-form-reset" @click="field.reset()">x</a>
      </ptj-form-row>
      <input type="submit" :value="getDictionary('ptj-filter-form-btn')" class="ptj-filter-form-submit" @click="$emit('close');">
  </form>
</template>

<script setup>

import PtjFormRow from "./ptj-form-row.vue"
import PtjId from "./ptj-id.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjTime from "./ptj-time.vue"
import PtjNumber from "./ptj-number.vue"
import PtjString from "./ptj-string.vue"
import { addToHistory } from "./../js/route.js"
import { Map } from "./../js/map.js"
import { RepoStore, loadRepo } from "./../js/repo.js"
import { getDictionary } from "./../js/dictionary.js"


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

