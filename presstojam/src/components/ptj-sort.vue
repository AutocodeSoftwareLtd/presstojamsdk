<template>
    <div class="ptj-drop-target" 
            @dragover="dragOver" 
            @dragenter="dragEnter"
            @dragleave="dragLeave"
            @drop="drop">
        <div v-for="(data, rindex) in RepoStore.data" 
            :key="rindex" 
            :id="data.primary"
            class="ptj-drag-target" 
            draggable="true" 
            @dragstart="dragStart"
            @dragend="dragEnd"
            >
            <span>{{ data.getSummary() }}</span>
        </div>
    </div>
</template>
<script setup>
import { RepoStore } from "./../js/repo.js"
import client from "./../js/client.js"
import { Map } from "./../js/map.js"

let _drag_target;
let _x =0;
let _y=0;

const emit = defineEmits(['reorder']);


function getDirection(x, y) {
    const dir_x = (x == _x) ? 0 : (x > _x) ? 1 : -1;
    const dir_y = (y == _y) ? 0 : (y > _y) ? 1 : -1;
      
    return { x : dir_x, y : dir_y };
}

function insertAfter(drop_target) {
    if (drop_target.nextElementSibling) {
        drop_target.parentNode.insertBefore(_drag_target, drop_target.nextElementSibling);
    } else {
        drop_target.parentNode.append(_drag_target);
    }
}

function insertBefore(drop_target) {
    drop_target.parentNode.insertBefore(_drag_target, drop_target);
}

function dragStart(ev) {
    const targ = ev.target;
    _drag_target = targ;
  
    ev.dataTransfer.dropEffect = "move";
    _drag_target.style.opacity = '0.4';

    _x = ev.clientX;
    _y = ev.clientY;
}


function dragEnd() {
    _drag_target.style.opacity = "1.0";
}


function dragEnter(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";

    const dir = getDirection(ev.clientX, ev.clientY);

    if (dir.y == 1) {
        insertAfter(ev.target.closest(".ptj-drag-target"));
    } else if (dir.y == -1) {
        insertBefore(ev.target.closest(".ptj-drag-target"));
    }
    _x = ev.clientX;
    _y = ev.clientY;
}

function dragLeave(ev) {
    ev.preventDefault();
}

function dragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}


function drop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    let indexes = getOrder();
    let url = "/data/" + Map.route + "/" + Map.model + "/resort";
    client.put(url, {"_rows" : indexes })
    .catch(e => console.log(e));


    const positions = {};
    for(let obj of indexes) {
        positions[obj['--id']] = obj['--sort'];
    }

    emit('reorder', positions);
   
}


function getOrder() {
    let index = [];
    const children = _drag_target.closest(".ptj-drop-target").querySelectorAll(".ptj-drag-target");
    for(let c=0; c<children.length; ++c) {
        index.push({"--id" : children[c].getAttribute("id"), "--sort" : c + 1});
    }
    return index;
}

</script>