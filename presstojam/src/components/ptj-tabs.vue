<template>
    <div :class="Class.getClass('ptj-tabs')">
        <div :class="Class.getClass('ptj-tabs-card')" v-for="parent in store.parent_models" :key="parent.name + '-parent'">
            <ptj-card :store="parent.store" />
        </div>
        <ptj-nav :actions="store.siblings" />
        <div :class="Class.getClass('ptj-tabs-tab')" >
            <component :key="store.index" :is="store.component" />
        </div>
    </div>
</template>
<script>

import GCForm from "./ptj-form.vue"
import GCRepo from "./ptj-repo.vue"
import GCNav from "./ptj-nav.vue"
import GCSingleItem from "./ptj-single-item.vue"
import GCAccountHandler from "./ptj-accounthandler.vue"
import GCCard from "./ptj-card.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


import { defineComponent } from 'vue'

export default defineComponent({
    props : {
        index: {
            type : Boolean,
        }
    },
    setup(props) {
        if (props.index) Ctrl.next();
        return { store : Ctrl.getStore(), Class }
    },
    components : {
        'ptj-form' : GCForm,
        'ptj-nav' : GCNav,
        'ptj-single-item' : GCSingleItem,
        'ptj-account-handler' : GCAccountHandler,
        'ptj-repo' : GCRepo,
        'ptj-card' : GCCard
    }

});
</script>