<template>
    <div class="ptj-progress-bar-wrapper">
        <div class="ptj-progress-holder">
            <div class="ptj-progress-bar" :style="'width:' + num + 'px'">&nbsp;</div> 
        </div>   
        <span>{{ num }}%</span>
    </div> 
</template>

<script setup>

import { computed } from "vue"

const props = defineProps({
    total : Number,
    progress : Number
});


const num = computed(() => {
    let num = Math.floor((props.progress / props.total) * 100);
    return (isNaN(num)) ? 0 : num;
});
</script>

<style scoped>
 .ptj-progress-holder {
     width : 100%;
     min-height : 10px;
     position : relative;
     display : flex;
     align-items: stretch;
     padding : 2px;
 }

 .ptj-progress-bar {
     width : 0;
     height : 100%;
     position : relative;
     line-height : 100%;
 }


</style>
