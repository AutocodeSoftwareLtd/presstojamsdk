<template>
    
    <Chart v-if="type=='bar'" type="bar" :data="chart_data" :options="bar_options" />
    <Chart v-else type="line" :data="chart_data" :options="options" />
</template>
<script setup>
import {computed } from "vue"
import Chart from 'primevue/chart';


const props = defineProps({
    data : [Object, Array],
    type : [String]
});


const chart_data = computed(() => {
    const obj = {
        labels : ['Count'],
        datasets : props.data
    }
    return obj;
});

const options = {
	responsive: true,
	hoverMode: 'index',
	stacked: false,
	/*scales: {
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
        },
        {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
                drawOnChartArea: false
            }
        }]
	}*/
}

const bar_options = {
    indexAxis : 'y'
}
</script>