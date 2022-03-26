<template>
    <div :class="Class.getClass('ptj-widget-window') + ' ' +  classes">
        <div :class="Class.getClass('ptj-widget-window-header')">
            <h1 :class="Class.getClass('ptj-widget-window-title')">{{ title }}
            <a :class="Class.getClass('ptj-widget-window-toggle')" @click="toggleWidget"><span class="material-icons">more_horiz</span></a>
            </h1>
        </div>
        <div class="Class.getClass('ptj-widget-window-body')" v-show="show">
            <slot />
        </div>
    </div>
</template>

<script>
import { defineComponent  } from 'vue'
import Class from "../js/classinjection.js"

export default defineComponent({
    props : {
        title : String,
        active : {
            type : Boolean,
            default : false
        },
        classes : {
            type : String,
            default : ''
        }
    },
    setup() {
       return { Class };
    },
    data() {
        return {
            show : this.active
        }
    },
    methods : {
        toggleWidget() {
            this.show = (this.show) ? false : true;
        }
    }
});

</script>