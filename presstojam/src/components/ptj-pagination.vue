<template>
 <div class="ptj-pagination">
     <a v-for="index in RepoStore.max_pages" 
     :key="index" 
     @click="changePage(index - 1)" 
     :class="getActiveClass(index)">{{ index }}</a>
 </div>
</template>
<script setup>
import { addToHistory } from "./../js/route.js"
import { loadRepo, RepoStore } from "./../js/repo.js"
import { Map } from "./../js/map.js"

function getActiveClass(index) {
    return (index - 1 == Map.params._page ?? 0) ? "ptj-pagination-active" : "";
}

function changePage(page) {
    Map.params_page = page;
    addToHistory();
    loadRepo();
}
</script>