<template>
    <filter-form :model="model" :data="{}" :name="props.schema.name"/>
    <group-form :model="model" :data="groups" :name="props.schema.name"/>
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
    <report-chart :data="summary_data" :type="type"/>
    <Divider v-if="schema.numeric.length > 0"/>
    <div v-for="(repo, index) in repos">
        <report-chart :data="repo.data.value" :type="type"/>
        <Divider v-if="schema.numeric.length > index -1" layout="vertical" />
    </div>

</template>
<script setup>

import ReportChart from "./report-chart.vue"
import FilterForm from "./../filter/filter-form.vue"
import GroupForm from "./../group/group-form.vue"
import { getModel } from "./../../js/models/modelmanager.js"
import Divider from 'primevue/divider';
import { createReportStore } from "./../../js/data/storemanager.js"
import { onBeforeUnmount, ref, computed } from "vue"
import { subscribe, unsubscribe } from "./../../js/bus/bus.js"
import Toolbar from 'primevue/Toolbar'
import Button from "primevue/button"
import Dropdown from 'primevue/dropdown';

const props = defineProps({
    schema : Object
});

//set up repos 
const groups = [];
const model = getModel(props.schema.name);

const summary_repo = createReportStore(model);
const summary_data = ref([]);
summary_repo.load().then(response => summary_data.value = response);

const repos = [];
for(let i in props.schema.numeric) {
    const repo = createReportStore(model, props.schema.numeric[i]);
    const repo_value = ref([]);
    repo.load().then(response => repo_value.value = response);
    repos.push({
        'repo' : repo,
        'data' : repo_value
    });
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
        summary_repo.groups = groups;
        summary_repo.reload(type.value)
        .then(response => summary_data.value = response);
         for(const repo of repos) {
            repo.repo.groups = groups;
            repo.repo.reload(type.value)
            .then(response => repo.data.value = response);
        }
    }
});


subscribe("filter_form", props.schema.name, (name, filters) => {
    if (name == props.schema.name) {
        summary_repo.filters = filters;
        for(const repo of repos) {
            repo.filters = filters;
        }
    }
});

onBeforeUnmount(() => {
    unsubscribe("group_form", props.schema.name);
    unsubscribe("filter_form", props.schema.name);
});


</script>