<template>
  <div :class="[Map.model, Map.state]">
    <button @click="toggleCreate()">Create</button>
    <ptj-modal :active="show_create" @close="toggleCreate()">
        <ptj-create-form @close="toggleCreate()" />
    </ptj-modal>
    <ptj-filter-form  v-if="settings.disable_filter != true"/>
    <ptj-selectfields v-if="settings.disable_selectfields != true" />
    <ptj-tree v-if="RepoStore.component=='tree'" />
    <ptj-list v-else-if="RepoStore.component=='list'" />
    <ptj-table v-else-if="RepoStore.component=='table'" />
    <ptj-pagination v-if="RepoStore.max_pages > 0" />
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import PtjTree from "./ptj-tree.vue"
import PtjTable from "./ptj-table.vue"
import PtjList from "./ptj-list.vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjSelectfields from "./ptj-selectfields.vue"
import PtjPagination from "./ptj-pagination.vue"
import PtjModal from "./ptj-modal.vue"
import PtjCreateForm from "./ptj-create-form.vue"
import { RepoStore, loadRepo } from "./../js/repo.js"
import { getModelSettings } from "./../js/route.js" 


const show_create = ref(false);

let settings = getModelSettings();

function toggleCreate() {
    show_create.value = (show_create.value) ? false : true;
}


onMounted(async () => {
    await loadRepo();
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}

</style>