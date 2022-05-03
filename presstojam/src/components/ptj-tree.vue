<template >
  <div class="ptj-tree ptj-drop-target'" ref="treeroot">
    <ptj-tree-node v-for="(key, index) in indexes['0']" :key="index" :row="key"  />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { DataRow } from "./../js/datarow.js"
import client from "./../js/client.js"
import PTJDragDrop from "./../js/dragndrop.js"
import PtjTreeNode from "./ptj-tree-node.vue"

const map = inject("map");
const meta = inject("meta");
const data = inject("data");
const indexes = inject("indexes");

console.log("Indexes", indexes);


onMounted(() => {
    if (meta.sortable) {
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
