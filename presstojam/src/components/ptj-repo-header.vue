<template>
    <h1 :class="Class.getClass('ptj-repo-header-title')">{{ store.title }}</h1>
    <p v-if="store.count">Number of rows: {{ store.count }}</p>
    <ptj-nav :actions="store.actions" :class="Class.getClass('ptj-repo-header-actions')"/>
    <ptj-filter-form  v-if="store.disable_filter != true"/>
    <ptj-selectfields v-if="store.disable_selectfields != true" />
</template>

<script>

import GCNav from "./ptj-nav.vue"
import GCFilterForm from "./ptj-filter-form.vue"
import GCPagination from "./ptj-pagination.vue"
import GCSelectFields from "./ptj-selectfields.vue"
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-header',
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
    components : {
        "ptj-nav" : GCNav,
        "ptj-filter-form" : GCFilterForm,
        "ptj-pagination" : GCPagination,
        "ptj-selectfields" : GCSelectFields
    }
});
</script>
