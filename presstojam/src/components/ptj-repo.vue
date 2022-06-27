<template>
  <div :class="[Map.model, Map.state]">
    <ptj-modal v-if="RouteStore.route.perms.includes('post')">
        <template #button>
            {{ getDictionary('ptj-repo-post') }}
        </template>
        <template #default="createScope">
            <ptj-create-form @close="createScope.toggleShow" />
        </template>
    </ptj-modal>
    <ptj-modal v-if="settings.disable_filter != true">
        <template #button>
            {{ getDictionary('ptj-repo-search') }} <span class="material-icons">search</span>
        </template>
        <template #default="filterScope">
            <ptj-filter-form @close="filterScope.toggleShow" />
        </template>
    </ptj-modal>
    <ptj-modal v-if="settings.disable_sort != true && RouteStore.sort && RouteStore.route.perms.includes('put')">
        <template #button>
            {{ getDictionary('ptj-repo-sort') }} <span class="material-icons">sort</span>
        </template>
        <template #default="sortScope">
            <ptj-sort @close="sortScope.toggleShow" @reorder="reorder"/>
        </template>
    </ptj-modal>
    <ptj-tree v-if="RepoStore.component=='tree'" />
    <ptj-list v-else-if="RepoStore.component=='list'" />
    <ptj-table v-else-if="RepoStore.component=='table'" />
    <ptj-pagination v-if="RepoStore.max_pages > 0" />
  </div>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount } from "vue"
import PtjTree from "./ptj-tree.vue"
import PtjTable from "./ptj-table.vue"
import PtjList from "./ptj-list.vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjSelectfields from "./ptj-selectfields.vue"
import PtjPagination from "./ptj-pagination.vue"
import PtjModal from "./ptj-modal.vue"
import PtjCreateForm from "./ptj-create-form.vue"
import { RepoStore, loadRepo, resetRepo, reorderRepo } from "./../js/repo.js"
import { getModelSettings, RouteStore } from "./../js/route.js" 
import { getDictionary } from "./../js/dictionary.js"
import PtjSort from "./ptj-sort.vue"


let settings = getModelSettings();

function reorder(positions) {
    reorderRepo(positions);
}


onMounted(async () => {
    await loadRepo();
});

onBeforeUnmount(() => {
    resetRepo();
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