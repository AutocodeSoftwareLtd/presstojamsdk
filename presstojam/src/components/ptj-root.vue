<template>
  <ptj-account-details v-if="isaccount" />
  <div :class="Class.getClass('ptj-root')" v-for="group in groups" :key="group.index">
    <ptj-tabs  :index="true"  />
 </div>
</template>
<script>

import { defineComponent } from 'vue'
import GCTabs from "./ptj-tabs.vue"
import GCAccountDetails from "./ptj-account-details.vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"


export default defineComponent({
    name : 'ptj-root',
    setup() {
        return { Class }
    },
    computed : {
        groups() {
            return Ctrl.store.models;
        },
        isaccount() {
            return Ctrl.store.profile == "public" ? false : true;
        }
    },
    components : {
        'ptj-tabs' : GCTabs, "ptj-account-details" : GCAccountDetails

    }
});
</script>