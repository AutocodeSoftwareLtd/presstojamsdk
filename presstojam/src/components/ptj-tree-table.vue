<template >
  <ptj-filter-form />
  <TreeTable :value="nodes">
    <Column :expander="true"></Column>
    <Column v-for="cell in fields" :field="cell.name"
                    :header="$t('models.' + cell.model + '.fields.' + cell.name + '.label')"
                    :key="cell.name">
        <template #body="slotProps">
          <ptj-view-field v-model="slotProps.node.data[cell.name]" :field="cell" />
        </template>
    </Column>
    <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <router-link v-if="has_primary" :to="{ name : 'primary', params : {'model' : model, 'id' : slotProps.node.data['--id']}}"
                    v-slot="{isActive, href, navigate, isExactActive}">
                    <a 
                        :class="{'active-link': isActive}" 
                        :href="href"
                        @click="navigate"
                    ><Button 
                        icon="pi pi-chevron-right" 
                        class="p-button-rounded p-button-success mr-2" 
                        /></a>
                </router-link>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRow(slotProps.node.data)" />
            </template>
        </Column>
</TreeTable>
</template>

<script setup>
  import Button from "primevue/Button"
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import PtjViewField from "./ptj-view-field.vue"
import { inject, computed } from "vue"
import PtjFilterForm from "./ptj-filter-form.vue"
import { getDataStoreById } from "./../js/datastore.js"


const model = inject("model");
const data_store = getDataStoreById(model);
const store =data_store.store;

function toTree(arr, parent_id = 0) {
  const nodes = [];
  const items = arr.filter(obj => obj['--recursive-id'] == parent_id);
  for (let i in items) {
    const obj = { key: items[i]['--id'], "data": { ...items[i] } };
    obj.children = toTree(arr, obj.key);
    nodes.push(obj);
  }
  return nodes;
}

const has_primary = (store.route.children.length > 1) ? true : false;
const has_expandable = (store.route.children.length == 1) ? true : false;
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;



const nodes = computed(() => {
  const data= toTree(store.data);
  return data;
});


let fields = computed(() => {
    let cells = {};
    for(let i in store.route.schema) {
        if (store.route.schema[i].background) continue;
        cells[i] = store.route.schema[i];
    }
    return cells;
});

</script>
