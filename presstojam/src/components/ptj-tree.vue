<template >
  <Splitter>
	  <SplitterPanel :size="20" style="padding:10px">
      <Toolbar class="mb-4">
                <template #start>
                  <ptj-create-action :model="model" :store="store" />
                </template>

                <template #end>
                  <Button type="button" v-if="expanded" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                  <Button type="button" v-else icon="pi pi-plus" label="Expand All" @click="expandAll" />
                  
                </template>
        </Toolbar>
        <Tree :value="nodes" :filter="true" filterMode="lenient" selectionMode="single" :expandedKeys="expandedKeys" @nodeSelect="onNodeSelect" v-model:selectionKeys="selectedKey"/>
	  </SplitterPanel>
	  <SplitterPanel :size="80" style="padding:10px">
      <div v-if="store.active && store.active['--id']">
        <Toolbar>
                <template #start>
                  <ptj-primary-action v-if="has_primary"  :model="model" :id="store.active['--id']" />
                  {{ label }}
                </template>

                <template #end>
                  <ptj-create-action :model="model" /> 
                    <ptj-delete-action :data="store.selected" :model="model" />
                </template>
              </Toolbar>
          <ptj-table :model="model" :store="store" :rows="childRows" v-if="store.active['--id']" @reorder="reorderRows" />
       </div>
    </SplitterPanel>
  </Splitter>
</template>

<script setup>
import Button from "primevue/Button"
import Tree from 'primevue/tree'
import { computed, ref } from "vue"
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import PtjTable from "./ptj-table.vue"
import Toolbar from 'primevue/Toolbar'
import { toTree, getForegroundCells, getLabel } from "./../js/helperfunctions.js" 
import PtjPrimaryAction from "./actions/ptj-primary-action.vue"
import PtjCreateAction from "./actions/ptj-create-action.vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"



const props = defineProps({
    model : String,
    store : Object
});


const has_primary = (props.store.route.children.length > 1) ? true : false;
const expanded = ref(false);
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;


const nodes = computed(() => {
  const data= toTree(props.store.data, props.store.route.schema);
  return data;
});


function reorderRows(rows) {
  childRows.value = rows;
}

let fields = computed(() => {
    return getForegroundCells(props.store.route.schema);
});

const childRows = ref([]);


const expandedKeys = ref({});
const selectedKey = ref();

const collapseAll = () => {
    expandedKeys.value = {};
    expanded.value = false;
};

const expandAll = () => {
    for (let node of nodes.value) {
        expandNode(node);
    }
    expandedKeys.value = {...expandedKeys.value};
    expanded.value = true;
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
      expandedKeys.value[node.key] = true;
      for (let child of node.children) {
          expandNode(child);
      }
    }
};

const label = computed(() => {
  return getLabel(props.store.route.schema, props.store.active);
})

const onNodeSelect = (node) => {
   props.store.active = node.data;
   childRows.value = props.store.data.filter(obj => obj['--recursive-id'] == node.key);
  /*  toast.add({
      severity:'success', 
      summary: 'Node Unselected', 
      detail: node.label, 
      life: 3000});*/
};

</script>
