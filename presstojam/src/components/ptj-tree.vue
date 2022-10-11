<template >
  <Splitter>
	  <SplitterPanel :size="20" style="padding:10px">
      <Toolbar class="mb-4">
                <template #start>
                  <Button type="button" v-if="expanded" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                  <Button type="button" v-else icon="pi pi-plus" label="Expand All" @click="expandAll" />
                  
                </template>
        </Toolbar>
        <Tree :value="nodes" :filter="true" filterMode="lenient" selectionMode="single" :expandedKeys="expandedKeys" @nodeSelect="onNodeSelect" v-model:selectionKeys="selectedKey"/>
	  </SplitterPanel>
	  <SplitterPanel :size="80" style="padding:10px">
      <div>
        <Message severity="success" v-if="delrow">Rows removed</Message>
        <Toolbar>
                <template #start>
                  <Button v-if="active['--id']" icon="pi pi-times" class="p-button-rounded p-button-success" @click="onNodeClear" />
                  <ptj-primary-action v-if="has_primary && active['--id']"  :model="model" :id="active['--id']" />
                  <ptj-edit-action v-if="active['--id']"  :model="model" :store="store" :data="active" />
                  {{ label }}
                </template>

                <template #end>
                    <ptj-move-action :model="model" :store="store" @onParentChanged="reload"/>
                    <ptj-create-action :store="store" @onSave="reload"/> 
                    <ptj-delete-action :data="store.selected.value" :model="model" @onDel="onDel" />
                </template>
              </Toolbar>
          <ptj-table :model="model" :store="store" :fields="fields" :rows="childRows" @reorder="reorderRows" />
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
import { toTree, getForegroundCells, getLabel, saveOrder } from "./../js/helperfunctions.js" 
import PtjPrimaryAction from "./actions/ptj-primary-action.vue"
import PtjCreateAction from "./actions/ptj-create-action.vue"
import PtjEditAction from "./actions/ptj-edit-action.vue"
import PtjDeleteAction from "./actions/ptj-delete-action.vue"
import PtjMoveAction from "./actions/ptj-move-action.vue"
import Message from 'primevue/message';



const props = defineProps({
    model : String,
    store : Object
});

const emits = defineEmits(["onMove"]);


const has_primary = (props.store.route.children.length > 1) ? true : false;
const expanded = ref(false);
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;
const active = ref({});
const delrow = ref(false);

const nodes = computed(() => {
  const data= toTree(props.store.data.value, props.store.route.schema);
  return data;
});


function reorderRows(rows) {
  childRows.value = rows;
  saveOrder(props.model, childRows.value);
}

let fields = computed(() => {
    return getForegroundCells(props.store.route.schema);
});

const childRows = ref([]);
childRows.value = props.store.data.value.filter(obj => obj['--recursive'] == 0);
active.value['--id'] = 0;

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

function onDel() {
    props.store.reload();
    props.store.selected.value = [];
    delrow.value = true;
}

const label = computed(() => {
  return getLabel(props.store.route.schema, active.value);
})

const onNodeSelect = (node) => {
   active.value = node.data;
   childRows.value = props.store.data.value.filter(obj => obj['--recursive'] == node.key);
   /*  toast.add({
      severity:'success', 
      summary: 'Node Unselected', 
      detail: node.label, 
      life: 3000});*/
};

const onNodeClear = (node) => {
  active.value = {};
  childRows.value = props.store.data.value.filter(obj => obj['--recursive'] == 0);
}



function reload() {
  emits("onMove");
}

</script>
