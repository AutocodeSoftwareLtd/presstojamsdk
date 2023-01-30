<template>
    <card>
        <template #title>
        {{ $t("models." + props.schema.name  + ".title")}}
       </template>
       <template #content>
        <filter-form :repo="summary_repo" :name="props.schema.name"/>
    <group-form :repo="summary_repo" :name="props.schema.name"/>
    <Toolbar>
        <template #start> 
            <label>Aggregates</label>
            <Dropdown optionValue="value" optionLabel="name" v-model="aggvalue" :options="aggregates" />
            <label v-show="type=='line'">Time Groups</label>
            <Dropdown v-show="type=='line'" optionValue="value" optionLabel="name" v-model="timevalue" :options="time_groups" />
        </template>
        <template #end>  
            <Button v-if="type=='bar'" @click="toggleType('line')" label="Line Chart" icon="pi pi-chart-line" class="mr-2" />
            <Button v-else  @click="toggleType('bar')" label="Bar Chart" icon="pi pi-chart-bar" class="mr-2" />
        </template>
    </Toolbar>
    <TabView>
        <TabPanel header="Summary">
            <report-chart :repo="summary_repo" :type="type"/>
        </TabPanel>
        <TabPanel v-for="repo in repos" :header="$t('models.' + props.schema.name + '.fields.' + repo.field + '.label')" >
            <report-chart :repo="repo" :type="type"/>
        </TabPanel>
    </TabView>

       </template>
    
    </card>
</template>
<script setup>

import ReportChart from "./report-chart.vue"
import FilterForm from "./../filter/filter-form.vue"
import GroupForm from "./../group/group-form.vue"
import { ReportData } from "./../../js/data/reportdata.js"
import { onBeforeUnmount, ref, computed } from "vue"
import { subscribe, unsubscribe } from "./../../js/bus/bus.js"
import Toolbar from 'primevue/Toolbar'
import Button from "primevue/button"
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';


const props = defineProps({
    schema : Object
});

//set up repos 
const groups = [];

const summary_repo = new ReportData(props.schema.name);
await summary_repo.load();

const repos = [];
for(let i in props.schema.numeric) {
    if (i == "--sort") continue;
    const repo = new ReportData(props.schema.name, props.schema.numeric[i]);
    await repo.load();
    repos.push(repo);
}

//menu bar functions

const type = ref('bar');

function toggleType(itype) {
    type.value = itype;
}

const agg = ref('COUNT');
const timevalue = ref('daily');

const aggvalue = computed({
    get() {
        return agg.value;
    },
    set(val) {
        props.repo.aggregate = val;
        agg.value = val;
    }
});

const aggregates = [
    { name : 'count', value : 'COUNT'},
    { name : 'average', value : 'AVG'},
    { name : 'minimum', value : 'MIN'},
    { name : 'maximum', value : 'MAX'}
];

const time_groups = [
    { name : 'Hourly', value : 'hourly'},
    { name : 'Daily', value : 'daily'},
    { name : 'Weekly', value : 'weekly'},
    { name : 'Monthly', value : 'monthly'},
    { name : 'Yearly', value : 'yearly'}
];




//subscribe / unsubscribe

subscribe("group_form", props.schema.name, (name, groups) => {
    if (name == props.schema.name) {
         for(const repo of repos) {
            repo.groups = groups;
            repo.reload(type.value);
        }
    }
});


subscribe("filter_form", props.schema.name, (name, filters) => {
    if (name == props.schema.name) {
        for(const repo of repos) {
            repo.filters = filters;
            repo.reload();
        }
    }
});

onBeforeUnmount(() => {
    unsubscribe("group_form", props.schema.name);
    unsubscribe("filter_form", props.schema.name);
});


</script>