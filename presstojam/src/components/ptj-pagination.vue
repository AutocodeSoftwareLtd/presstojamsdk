<template>
 <div class="ptj-pagination">
     <a v-for="index in RepoStore.max_pages" 
     :key="index" 
     @click="changePage(index)" 
     :class="getActiveClass(index)">{{ index }}</a>
 </div>
</template>
<script setup>
import { addToHistory } from "./../js/route.js"
import { loadRepo, RepoStore } from "./../js/repo.js"
import { Map } from "./../js/map.js"

function getActiveClass(index) {
    return (index == Map.params._page ?? 1) ? "ptj-pagination-active" : "";
}

function changePage(page) {
    Map.params._page = page;
    addToHistory();
    loadRepo();
}
</script>