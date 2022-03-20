<template>
<div :class="Class.getClass('ptj-repo') + ' ' + store.classes">
    <ptj-repo-header  />
    <component :key="store.key" :is="store.rawcomponent" />
</div>
</template>

<script>


import PTJRepoHeader from "./ptj-repo-header.vue"
import PTJTree from "./ptj-tree.vue"
import PTJTable from "./ptj-table.vue"
import PTJList from "./ptj-list.vue"
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
  name: 'ptj-repo',
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
    components : {
        "ptj-repo-header" : PTJRepoHeader,
        "ptj-tree" : PTJTree,
        "ptj-table" : PTJTable,
        "ptj-list" : PTJList
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