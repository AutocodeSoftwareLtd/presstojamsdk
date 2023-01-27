<template >
    <Splitter>
     <SplitterPanel>
      <Message severity="success" v-if="newrow">New row created</Message>
    <Message severity="success" v-if="delrow">Rows removed</Message>
      <Toolbar class="mb-4">
      <template #start>
        <Button type="button" v-if="expanded" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
        <Button type="button" v-else icon="pi pi-plus" label="Expand All" @click="expandAll" />
                  
      </template>
      <template #end> 
          <ptj-create-action :name="name" v-if="store.perms.includes('post')" :model="store" :parent_id="parseInt(repo.parent_id)"/> 
      </template>
    </Toolbar>
          <Tree :value="data" selectionMode="single" @node-select="setActive" :filter="true" filterMode="lenient" v-model:selectionKeys="selected" :expandedKeys="expandedKeys">
            <template #default="slotProps">
                <ptj-view-field v-for="cell in cells" :row="slotProps.node.data" :field="cell" />
              </template>
        </Tree>
    </SplitterPanel>
    <SplitterPanel>
      <Panel v-if="active['--id']" :header="$t('models.' +store.name + '.title')" :key="active['--id']">
            <template #icons>
                <audit-action v-if="store.audit" :model="store" :data="active" :long="true" />
                <ptj-delete-action :name="name" :data="active" v-if="store.perms.includes('delete')"/>
                <ptj-primary-action :model="store.name" :id="active['--id']" />
                <component v-for="component in store.actions" :is="component.component" :data="active" v-bind="component.atts"/>
            </template>
            <Message severity="success" v-if="saved">Saved</Message>
            <edit-effect v-if="active['--id']" :id="active['--id']" name="store.name" :data="active" />
            </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<script setup>
import Button from "primevue/button"
import Tree from 'primevue/tree';
import { ref, onBeforeUnmount } from "vue"
import Toolbar from 'primevue/Toolbar'
import { toTree } from "../../js/helperfunctions.js" 
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import PtjPrimaryAction from "../actions/primary-action.vue"
import Message from 'primevue/message';
import PtjViewField from "../view/view-field.vue"
import PtjCreateAction from "../actions/create-action.vue"
import PtjDeleteAction from "../actions/delete-action.vue"
import EditEffect from "../effects/edit-effect.vue"
import AuditAction from "../actions/audit-action.vue"
import Panel from "primevue/panel"
import { subscribe, unsubscribe, trigger } from "./../../js/bus/bus.js"

const props = defineProps({
    name : {
      type : String,
      required : true
    },
    repo : Object
});

console.log("Repo is ", props.repo);
const store = props.repo.store;


const expanded = ref(false);
const delrow = ref(false);
const newrow = ref(false);
const has_sort = store.fields['--sort'];
const saved = ref(false);


store.setTableCells();
const cells = store.getEnabledSummaryCells();

const selected = ref(null);

const data = ref([]);
const active = ref({});



function reorderRows(rows) {
  data.value = rows;
  store.saveOrder(rows);
}

props.repo.load()
.then(() => {
   data.value = toTree(props.repo.data.value, store.fields);
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


function setActive(node) {
  active.value = node.data;
  saved.value = false;
}

function reload() {
  repo.selected.value = [];
  repo.reload()
  .then(response => {
    data.value = toTree(response, store.fields);
  });
  newrow.value = true;
}


subscribe("effect_created", props.name, (name, response) => {
    if (props.name == name) {
        newrow.value = true;
        repo.reload()
        .then(response => {
          data.value = toTree(response, store.fields);
        });
        trigger("dialog_close");
    }
});

subscribe("effect_deleted", props.name, name => {
    if (props.name == name) {
        delrow.value = true;
        repo.reload()
        .then(response => {
          data.value = toTree(response, store.fields);
        });
        trigger("dialog_close");
    }
});


subscribe("effect_updated", props.name, (name, response) => {
    if (props.name == name) {
        saved.value = true;
        repo.reload()
        .then(response => {
          data.value = toTree(response, store.fields);
        });
    }
});

onBeforeUnmount(() => {
  unsubscribe("effect_created", props.name);
  unsubscribe("effect_updated", props.name);
  unsubscribe("effect_deleted", props.name);
});

</script>
<style scoped>

.wrapper {
  display : grid;
  margin-left : 0;
  margin-right : 0;
  box-sizing : content-box;
}

</style>
