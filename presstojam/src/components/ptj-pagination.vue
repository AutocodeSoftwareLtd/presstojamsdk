<template>
 <div :class="Class.getClass('ptj-pagination')">
     <a v-show="optiongroup > 0" @click="showPages(-1);">&lt;&lt;</a>
     <a v-for="index in maxoptions" :key="index" @click="page(index)">{{ firstindex + index }}</a>
     <a v-show="current_group < groups - 1" @click="showPages(1)">&gt;&gt;</a>
 </div>
</template>
<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
    props : {
        max_page_limit : Number
    },
    setup(props) {
        let groups = Math.ceil(props.pages / props.max_page_limit);
        return {
            groups, current_group : 0, Class
        }
    },
    computed : {
        firstindex() {
            return this.current_group * this.max_options;
        },
        maxoptions() {
            return [];
        }
    },
    methods : {
        showPages(index) {
            let route = Controller.current_route.value;
            let url = route + "#";
            if (route.query) url += route.query + "&";
            url += "__page=" + (this.firstindex + index);
            Router.setRoute(url);
        }
    }
});
</script>