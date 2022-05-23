<template>
  <div :class="[Map.model, Map.state]">
    <button @click="toggleCreate()">Create</button>
    <ptj-modal :active="show_create" @close="toggleCreate()">
        <ptj-create-form @close="toggleCreate()" />
    </ptj-modal>
    <ptj-filter-form  v-if="settings.disable_filter != true"/>
    <ptj-selectfields v-if="settings.disable_selectfields != true" />
    <ptj-tree v-if="component=='tree'" />
    <ptj-list v-else-if="component=='list'" />
    <ptj-table v-else-if="component=='table'" />
    <ptj-pagination v-if="RepoStore.meta.limit > 0" />
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from "vue"
import { DataRow } from "../js/datarow.js"
import client from "../js/client.js"
import PtjTree from "./ptj-tree.vue"
import PtjTable from "./ptj-table.vue"
import PtjList from "./ptj-list.vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import PtjSelectfields from "./ptj-selectfields.vue"
import PtjPagination from "./ptj-pagination.vue"
import Settings from "../js/settings.js"
import PtjModal from "./ptj-modal.vue"
import PtjCreateForm from "./ptj-create-form.vue"
import { MetaRow } from "../js/metarow.js"
import { RepoStore, loadRepo } from "../js/repo.js"


const settings = Settings.getModelSettings(Map.model, Map.state);
const show_create = ref(false);

const component = computed(() => {
    if (settings.component) return settings.component;
    else if (!RepoStore.meta.cells) return "";
    else return (RepoStore.meta.store.index || RepoStore.meta.children.length > 0) ? "tree" : "table";
});

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