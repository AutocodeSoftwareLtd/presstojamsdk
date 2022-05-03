<template >
    <div class="ptj-tree-node ptj-draggable" :id="branch.primary.toVal()" draggable="false">
        <div class="ptj-tree-node-row">  
            <div>
                <a v-if="ischild" data-action="more" class="button" @click.prevent.stop="toggle(branch.primary.toVal())">
                    <span class="material-icons">subdirectory_arrow_right</span>
                </a>
                <a v-else data-action="more" class="button" @click.prevent.stop="toggle(branch.primary.toVal())">
                    <span class="material-icons">keyboard_arrow_right</span>
                </a>
            </div>
            <div v-if="meta.sortable">
                <a data-action="more" class="button" @click="prevent.stop" @mousedown="setDraggable" @mouseup="endDraggable">
                    <span class="material-icons">drag_handle</span>
                </a>
            </div>
            <div>{{ branch.getSummary() }}</div>
            <ptj-button :route="{state:'primary', key:branch.primary.toVal() }"><span class="material-icons">arrow_forward_ios</span></ptj-button>
        </div>
        <ptj-tree-node v-for="(key, index) in children" :row="key" :ischild="true"  :key="index" v-show="toggle_state[branch.primary.toVal()]" />
    </div>
</template>

<script setup>
import { inject, reactive, computed } from "vue"
import PtjButton from "./ptj-button.vue"

const props = defineProps({
    row : { 
        type : [String, Number],
        required : true
    },
    draggable : Boolean,
    ischild : {
        type : Boolean,
        default : false
    }
});


const data = inject("data");
const indexes = inject("indexes");
const meta = inject("meta");
const branch = data.value[props.row];

const toggle_state = reactive({});
   
function toggle(index) {
    toggle_state[index] = (toggle_state[index]) ? false : true;
}
    

const children = computed(() => {
    const id = branch.primary.toVal();
    return (indexes[id]) ? indexes[id] : [];
});
</script>

<style scoped>

.model-tree.branch {
  padding-left: 8px;
  padding-right: 8px;
  margin: 6px 0;
  background-color:#111111;
}

.tree .ide-block {
	display : none;
}

.dragArea {
  min-height: 50px;
  outline: 1px solid #777777;
}


</style>