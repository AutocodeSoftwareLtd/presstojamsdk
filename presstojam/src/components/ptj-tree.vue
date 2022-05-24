<template >
  <div class="ptj-tree ptj-drop-target'" ref="treeroot">
    <ptj-tree-node v-for="(key, index) in RepoStore.indexes['0']" :key="index" :row="key"  />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import PTJDragDrop from "./../js/dragndrop.js"
import PtjTreeNode from "./ptj-tree-node.vue"
import { RepoStore } from "./../js/repo.js"


onMounted(() => {
    if (RepoStore.meta.sortable) {
        PTJDragDrop.initDD({
            handle : '.ptj-drag-handle',
            drag_target : '.ptj-draggable',
            drop_target : '.ptj-drop-target',
            callback : saveSort
        });
    }
});


function saveSort() {

}

</script>
