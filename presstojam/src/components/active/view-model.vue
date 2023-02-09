<template>
    <Panel :header="$t('models.' +store.name + '.title')">
      <template #icons>
          <component v-for="component in store.actions" 
            :is="component.component" :store="props.active" 
            v-bind="component.atts"/>
      </template>
      <div v-for="cell in cells" class="row">
	        <view-field :field="cell" :row="active.data.value" />
	      </div>
    
      <div v-for="child in store.fields['--id'].reference" :header="$t('models.' + child + '.title', 2)">
            <PtjChildPanel :model="child" />
      </div>
    </Panel>
</template>
<script setup>
import ViewField from "../view/view-field.vue"
import PtjChildPanel from  "./child-panel.vue"
import Panel from "primevue/panel"

const props = defineProps({
    active : Object
});


const cells = props.active.store.getEnabledCells();
const store = props.active.model;

</script>