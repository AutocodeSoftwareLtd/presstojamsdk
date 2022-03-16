<template>
    <div :class="Class.getClass('ptj-progress-bar-wrapper')">
        <div :class="Class.getClass('ptj-progress-bar-holder') + ' ptj-progress-holder'">
            <div :class="Class.getClass('ptj-progress-bar') + ' ptj-bar'" :style="style">&nbsp;</div> 
        </div>   
        <span>{{ num }}%</span>
    </div> 
</template>

<script>

import { defineComponent} from "vue"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-progress-bar',
  props : {
      total : Number,
      progress : Number
  },
  setup() {
       return { Class };
  },
  computed : {
      num() {
          let num = Math.floor((this.progress / this.total) * 100);
          return (isNaN(num)) ? 0 : num;
      },
      style() {
          return "width:" +  this.num + "%;";
      }
  }
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

 .ptj-bar {
     width : 0;
     height : 100%;
     position : relative;
     line-height : 100%;
 }


</style>
