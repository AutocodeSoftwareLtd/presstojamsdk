<template>
    <div class="ptj-multiple-select">
        <div class="ptj-multiple-select-display">
            <div class="ptj-multiple-select-values">
                <div class="ptj-multiple-select-val" v-for="val in field.change1" :key="val">
                    {{ val }}
                    <a class="ptj-multiple-select-val-remove" @click="remove(val)"><span class="material-icons">close</span></a>
                </div>
            </div>
            <input type="text" v-model="custom_val" />
            <a @click="selectCustom" class="ptj-multiple-select-add">add</a>
        </div>
    </div>
</template>
<script setup>

import { ref } from "vue"


const props = defineProps({
    field : Object,
});

const custom_val = ref("");

function remove(key) {
    props.field.change = props.field.change.filter(function(item) {
        return item !== key
    });
}

function selectCustom() {
    props.field.change1 = custom_val.value;
    custom_val.value = "";
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


.ptj-multiple-select-display {
    position :relative;
    background-color : #fff;
    border : 1px solid #cdcdcd;
    min-height : 35px;

}

</style>