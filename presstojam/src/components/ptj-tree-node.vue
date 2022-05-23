<template >
    <div class="ptj-tree-node ptj-draggable" :id="primary" draggable="false">
        <div class="ptj-tree-node-row">  
            <div>
                <a v-if="ischild" data-action="more" class="button" @click.prevent.stop="toggle()">
                    <span class="material-icons">subdirectory_arrow_right</span>
                </a>
                <a v-else data-action="more" class="button" @click.prevent.stop="toggle()">
                    <span class="material-icons">keyboard_arrow_right</span>
                </a>
            </div>
            <div v-if="RepoStore.meta.sortable">
                <a data-action="more" class="button" @click="prevent.stop" @mousedown="setDraggable" @mouseup="endDraggable">
                    <span class="material-icons">drag_handle</span>
                </a>
            </div>
            <div>{{ summary }}</div>
            <ptj-button :route="{state:'primary', key:primary }"><span class="material-icons">arrow_forward_ios</span></ptj-button>
        </div>
        <ptj-tree-node v-for="(key, index) in children" :row="key" :ischild="true"  :key="index" v-show="store.toggle_state[primary]" />
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue"
import PtjButton from "./ptj-button.vue"
import { RepoStore } from "../js/repo.js"

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

const store = reactive({ toggle_state : {}, branch : null });

function toggle() {
    const index = store.branch.primary.val;
    store.toggle_state[index] = (store.toggle_state[index]) ? false : true;
}

const children = computed(() => {
    if (!store.branch) return [];
    const id = store.branch.primary.val;
    return (RepoStore.indexes[id]) ? RepoStore.indexes[id] : [];
});

const primary = computed(() => {
    if (!store.branch) return 0;
    return store.branch.primary.val;
});

const summary = computed(() => {
    if (!store.branch) return "";
    return store.branch.getSummary();
});

onMounted(() => {
    store.branch = RepoStore.data[props.row];
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