<template>
    <div class="ptj-multiple-select">
        <div class="ptj-multiple-select-display">
            <div class="ptj-multiple-select-values">
                <div class="ptj-multiple-select-val" v-for="val in field.change" :key="val">
                    {{ field.getOption(val) }}
                    <a class="ptj-multiple-select-val-remove" @click="remove(val)"><span class="material-icons">close</span></a>
                </div>
            </div>
            <a class="ptj-multiple-select-arrow" @click="toggleList">
            <span class="material-icons">{{ show_list.symbol }}</span>
            </a>
        </div>
        <ul class="ptj-multiple-select-options" v-show="show_list.display" @click="select">
            <li v-for="option in field.options" :key="option.key" :data-key="option.key">{{ option.value }}</li>
        </ul>
    </div>
</template>
<script setup>

import { reactive, onMounted } from "vue"
import { Map } from "./../js/route.js"

const props = defineProps({
    field : Object,
});

onMounted(() => {
    if (props.field.reference) {
        let url = "/reference/" + Map.model + "/" + props.field.name;
        props.field.setReferenceOptions(url, {"--parentid":Map.key});
    }
});


const show_list = reactive({
    display : false,
    symbol : 'keyboard_arrow_down'
});


function toggleList() {
    if (show_list.display) {
        show_list.display = false;
        show_list.symbol = 'keyboard_arrow_down';
    } else {
        show_list.display = true;
        show_list.symbol = 'keyboard_arrow_up';
    }
}


function remove(key) {
    props.field.change = props.field.change.filter(function(item) {
        return item !== key
    });
}



function select(e) {
    props.field.change1 = e.target.getAttribute("data-key");
    toggleList();
}
</script>
<style scoped>
.ptj-multiple-select-val {
    display : inline-block;
    border : 1px solid green;
    margin-left : 2px;
    margin-right : 2px;
    padding : 2px;
    background-color : green;
}


.ptj-multiple-select-val-remove {
    color : red;
}

.ptj-multiple-select-arrow {
    position :absolute;
    right : 2px;
    top : 3px;
}

.ptj-multiple-select-display {
    position :relative;
    background-color : #fff;
    border : 1px solid #cdcdcd;
    min-height : 35px;

}

.ptj-multiple-select-options li {
    list-style: none;
    cursor: pointer;
    margin-top : 2px;
    border : 1px solid #cdcdcd;
    background-color : #fff;
}

.ptj-multiple-select-options li:hover {
    background-color : #f9f9fb;
    transition : background-color .2s ease-out,border .2s ease-out;
}
</style>