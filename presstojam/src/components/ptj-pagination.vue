<template>
 <div :class="Class.getClass('ptj-pagination')">
     <a v-for="index in store.data_template.max_pages" :key="index" @click="setPage(index)" :class="getActiveClass(index)">{{ index }}</a>
 </div>
</template>
<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"
import Ctrl from "../js/controller.js"


export default defineComponent({
    setup() {
        return { store : Ctrl.getStore(), Class }
    },
    methods : {
        setPage(index) {
            this.store.setPage(index - 1);
            Ctrl.buildLink(true);
        },
        getActiveClass(index) {
            return (index - 1 == this.store.data_template.page) ? "ptj-pagination-active" : "";
        }
    }
});
</script>