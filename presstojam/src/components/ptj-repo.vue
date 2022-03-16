<template>
<div :class="Class.getClass('ptj-repo') + ' ' + store.classes">
    <ptj-repo-header  />
    <component :key="store.key" :is="store.rawcomponent" />
</div>
</template>

<script>


import GCRepoHeader from "./ptj-repo-header.vue"
import GCTree from "./ptj-tree.vue"
import GCTable from "./ptj-table.vue"
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-repo',
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
    components : {
        "ptj-repo-header" : GCRepoHeader,
        "ptj-tree" : GCTree,
        "ptj-table" : GCTable
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}



.ptj-data-row:nth-child(odd) {background : #CCC}

</style>