<template >
  <div :class="Class.getClass('ptj-tree') + ' ' + store.classes + ' ptj-drop-target'" ref="treeroot">
    <ptj-tree-node v-for="(obj, index) in store.data" :key="index" :branch="obj"  />
  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue'
import GCNav from "./ptj-nav.vue"
import GCTreeNode from "./ptj-tree-node.vue"
import GCDragDrop from "../js/dragndrop.js"
import GCFilterForm from "./ptj-filter-form.vue"
import GCSelectFields from "./ptj-selectfields.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


export default defineComponent({
	name : "ptj-tree",
    setup(props) {
        let base = { store : Ctrl.getStore(), treeroot : ref(null), Class };
        onMounted(() => {
           //if (ctrl.sort) {
             GCDragDrop.initDD({
               handle : '.ptj-drag-handle',
               drag_target : '.ptj-draggable',
               drop_target : '.ptj-drop-target',
               main : base.treeroot.value,
               tree : base.store.data,
               callback : base.store.saveSort
             });
           //}
        });

       return base;
   },
    components : {
        "ptj-nav" : GCNav,
        "ptj-tree-node" : GCTreeNode,
        "ptj-filter-form" : GCFilterForm,
        "ptj-selectfields" : GCSelectFields
    }
});


</script>
