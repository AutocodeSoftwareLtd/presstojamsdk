<template>
    <div class="ptj-drop-target">
        <div v-for="(str, rindex) in data" :key="rindex" class="ptj-drag-target" draggable="true" @dragstart="drag(this)">
            <span>str</span>>
        </div>
    </div>
</template>
<script setup>

const props = defineProps({
    data : Array
});

let current_targ = null;

function drag(el) {
    current_targ = el;
}

function ptjDrag(drag_handle, drag_item, drop_target) {
    _drag_target = drag_item;
    _drop_target = drop_target;
    drag_item.addEventListener("dragstart", e => drag.dragStart(e));
    drag_item.addEventListener("dragenter", e => drag.dragEnter(e));
    drop_target.addEventListener("dragover", e => drag.dragOver(e));
    drop_target.addEventListener("drop", e => drag.drop(e));
    drag_item.addEventListener("dragend", e => drag.dragEnd(e));
}
</script>