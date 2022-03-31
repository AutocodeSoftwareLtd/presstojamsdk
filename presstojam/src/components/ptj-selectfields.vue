<template>
    <ptj-widget title="select fields" :classes="Class.getClass('ptj-selectfields')">
        <div v-for="field, name in store.fields" :key="name"> 
            <input 
                type="checkbox" 
                v-model="field.summary" 
                :true-value="1" :false-value="0"
                :class="Class.getClass('ptj-selectfields-checkbox')"> 
            <label :class="Class.getClass('ptj-selectfields-label')">{{ field.name }}</label>
        </div>
    </ptj-widget>
</template>

<script>
import { defineComponent } from 'vue'
import GCWidget from "./ptj-widget-window.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


export default defineComponent({
    setup() {
        return { store : Ctrl.getStore(), Class }
    },   
    components : {
        "ptj-widget" : GCWidget
    }
});
</script>

