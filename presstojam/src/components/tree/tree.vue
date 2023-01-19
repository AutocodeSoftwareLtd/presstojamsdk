<template >
  <Message severity="success" v-if="newrow">New row created</Message>
        <Message severity="success" v-if="delrow">Rows removed</Message>
    <Toolbar class="mb-4">
      <template #start>
        <Button type="button" v-if="expanded" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
        <Button type="button" v-else icon="pi pi-plus" label="Expand All" @click="expandAll" />
                  
      </template>
      <template #end> 
        <Toolbar>
                <template #start>
                  <Button v-if="repo.active.value['--id']" icon="pi pi-times" class="p-button-rounded p-button-success" @click="onNodeClear" />
                  <ptj-primary-action v-if="has_primary && repo.active.value['--id']"  :model="store.name" :id="repo.active.value['--id']"/>
                  <ptj-edit-action v-if="repo.active.value['--id']"  :store="store" :data="repo.active.value" />
                  {{ label }}
                </template>

                <template #end>
                    <ptj-move-action :name="name" @onMove="reload" v-if="store.perms.includes('put')"/>
                    <ptj-create-action :name="name" @onSave="reload" v-if="store.perms.includes('post')"/> 
                    <ptj-delete-action :name="name" @onDel="onDel" v-if="store.perms.includes('delete')"/>
                </template>
          </Toolbar>
        </template>
    </Toolbar>
    <TreeTable :value="data" :expandedKeys="expandedKeys">
        <Column :expander="true" headerStyle="width: 3rem" />
        <Column v-if="has_sort" :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />
        <Column v-if="store.perms.includes('delete')" selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column v-for="cell in store.fields" :field="cell.name"
                    :header="$t('models.' + store.name + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
            <template #body="slotProps">

                <ptj-view-field :row="slotProps.node.data" :field="cell" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <ptj-primary-action v-if="has_primary" :model="store.name" :id="slotProps.node.data['--id']" />
                <edit-action v-if="store.perms.includes('put')" :data="slotProps.node.data" :model="store" />
                <audit-action v-if="store.audit" :data="slotProps.node.data" :model="store" />
                <component v-for="component in store.actions" :is="component.component" v-bind="component.atts" :data="slotProps.node.data" :short="true" />
            </template>
        </Column>
    </TreeTable>
</template>

<script setup>
import Button from "primevue/button"
import TreeTable from 'primevue/treetable';
import { computed, ref } from "vue"
import Toolbar from 'primevue/Toolbar'
import { toTree, getForegroundCells, getLabel, saveOrder } from "../../js/helperfunctions.js" 
import PtjPrimaryAction from "../actions/primary-action.vue"
import Message from 'primevue/message';
import { getStore } from "../../js/data/storemanager.js"
import Column from 'primevue/column';
import PtjViewField from "../view/view-field.vue"
import PtjMoveAction from "../actions/move-action.vue"
import PtjCreateAction from "../actions/create-action.vue"
import PtjDeleteAction from "../actions/delete-action.vue"
import EditAction from "../actions/edit-action.vue"
import AuditAction from "../actions/audit-action.vue"




const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const emits = defineEmits(["onMove"]);

const repo = getStore(props.name);
const store = repo.store;



const has_primary = (store.fields['--id'].reference.length > 1) ? true : false;
const expanded = ref(false);
const delrow = ref(false);
const newrow = ref(false);
const has_sort = store.fields['--sort'];

const selected = ref([]);

const data = ref([]);

let fields = computed(() => {
    return getForegroundCells(store.fields);
});


function reorderRows(rows) {
  data.value = rows;
  saveOrder(store.name, rows);
}

repo.load()
.then(response => {
   data.value = toTree(response, store.fields);
});


repo.active.value['--recursive'] = 0;

const expandedKeys = ref({});

const collapseAll = () => {
    expandedKeys.value = {};
    expanded.value = false;
};

const expandAll = () => {
    for (let node of data.value) {
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
    repo.reload()
    .then(() => {
      childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
    });
    delrow.value = true;
}

const label = computed(() => {
  return getLabel(store.fields, repo.active.value);
})



function reload() {
  repo.selected.value = [];
  repo.reload()
  .then(response => {
    data.value = toTree(response, store.fields);
  });
  newrow.value = true;
}

</script>
<style scoped>

.wrapper {
  display : grid;
  margin-left : 0;
  margin-right : 0;
  box-sizing : content-box;
}

</style>
