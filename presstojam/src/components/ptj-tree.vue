<template >
  <div class="ptj-tree ptj-drop-target'" ref="treeroot">
    <ptj-tree-node v-for="(key, index) in RepoStore.indexes['0']" :key="index" :row="key"  />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import PtjTreeNode from "./ptj-tree-node.vue"



</script>
