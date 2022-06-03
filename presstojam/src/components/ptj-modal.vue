<template>
  <a @click="toggleShow" class="ptj-modal-button"><slot name="button"></slot></a>
  <teleport :disabled="disabled" :to="location">
  <div class="ptj-modal-backdrop" v-show="active" :class="getClass" :style="relstyle">
    <div class="ptj-modal" :class="cls">
        <header>
            <button
          type="button"
          class="btn-close"
          @click="toggleShow"
        >
          x
        </button>
        </header>
      <slot :toggleShow="toggleShow" name="default">
      </slot>
    </div>
  </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
    location : {
        default : 'body'
    },
    relative : {
        default : false
    },
    cls : String
});

let active = ref(false);

function toggleShow() {
    active.value = (active.value) ? false : true;
}

function getOffsetToWrapper(el) {
    let obj = {
        left : 0,
        top : 0,
        width : el.offsetWidth,
        height : el.offsetHeight,
        wrapper : 0
    };
    
    while(!el.classList.contains('ptj-table-wrapper')) {
        obj.left += el.offsetLeft;
        obj.top += el.offsetTop;
        el=el.parentNode;
    }

    obj.wrapper = el.offsetWidth;

    return obj;
}

let relstyle = computed(() => {
    if (props.relative) {
        let obj = getOffsetToWrapper(props.relative);
        let right = obj.wrapper - (obj.left + obj.width);
        return "position:absolute;top:" + (obj.top + obj.height) + "px;right:0px;";
    } else {
        return "";
    }
});


let disabled = computed(() => {
    return (props.location) ? false : true;
});


let getClass = computed(() => {
    if (props.location == 'body') {
        return "ptj-modal-backdrop-full";
    } else {
        return "";
    }
});




</script>
<style>
.ptj-modal-backdrop-full {
    position : absolute;
    top : 0;
    left : 0;
    height : 100vh;
    width : 100vw;
}
</style>