<template>
  <div :class="[Map.model, Map.state]">
    <ptj-modal>
        <template #button>
            Create
        </template>
        <template #default="createScope">
            <ptj-create-form @close="createScope.toggleShow" />
        </template>
    </ptj-modal>
    <ptj-modal v-if="settings.disable_filter != true">
        <template #button>
            Search <span class="material-icons">search</span>
        </template>
        <template #default="filterScope">
            <ptj-filter-form @close="filterScope.toggleShow" />
        </template>
    </ptj-modal>
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


let settings = getModelSettings();




onMounted(async () => {
    await loadRepo();

});

</script>
<script>

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}

</style>