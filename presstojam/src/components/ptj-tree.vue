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
                  <Button v-if="repo.active.value['--id']" icon="pi pi-times" class="p-button-rounded p-button-success" @click="onNodeClear" />
                  <ptj-primary-action v-if="has_primary && repo.active.value['--id']"  :model="store.model" :id="repo.active.value['--id']"/>
                  <ptj-edit-action v-if="repo.active.value['--id']"  :store="store" :data="repo.active.value" />
                  {{ label }}
                </template>

                <template #end>
                    <ptj-move-action :name="name + '_selected'" @onMove="reload"/>
                    <ptj-create-action :name="name" @onSave="reload"/> 
                    <ptj-delete-action :name="name + '_selected'" @onDel="onDel" />
                </template>
              </Toolbar>
          <ptj-table :name="name + '_selected'" :fields="fields" @reorder="reorderRows" />
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
import { createRepoStore, getStore, regStore } from "./../js/reactivestores.js"



const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const emits = defineEmits(["onMove"]);

const repo = getStore(props.name);
const store = repo.store;


const has_primary = (store.route.children.length > 1) ? true : false;
const expanded = ref(false);
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;
const delrow = ref(false);
const childRepo = createRepoStore(store);
regStore(props.name + "_selected", childRepo);
childRepo.parent_id = repo.parent_id;
const selected = ref([]);


const nodes = computed(() => {
  const data= toTree(repo.data.value, store.route.schema);
  return data;
});


let fields = computed(() => {
    return getForegroundCells(store.route.schema);
});


function reorderRows(rows) {
  childRepo.data.value = rows;
  saveOrder(props.model, childRows.value);
}

repo.load()
.then(response => {
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
});


repo.active.value['--recursive'] = 0;

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
    store.reload()
    .then(response => {
      data_rows.value = response;
      childRows.value = data_rows.value.filter(obj => obj['--recursive'] == repo.active.value['--id']);
    });
    delrow.value = true;
}

const label = computed(() => {
  return getLabel(store.route.schema, repo.active.value);
})

const onNodeSelect = (node) => {
   repo.active.value = node.data;
   console.log(repo.active.value);
   childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == node.key);
   /*  toast.add({
      severity:'success', 
      summary: 'Node Unselected', 
      detail: node.label, 
      life: 3000});*/
};

const onNodeClear = (node) => {
  repo.active.value = {};
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
}



function reload() {
  emits("onMove");
}

</script>
