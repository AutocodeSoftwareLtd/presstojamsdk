 <template>
    <ptj-number-filter v-if="bind.cell.type=='number'" :bind="bind" />
    <ptj-flag-filter v-else-if="bind.cell.type=='flag'" :bind="bind" />
    <ptj-id-filter v-else-if="bind.cell.type=='id'" :bind="bind" />
    <ptj-time-filter v-else-if="bind.cell.type=='time'" :bind="bind" />
    <ptj-string-filter v-else-if="bind.cell.type=='string'" :bind="bind" />
</template>
<script setup>
 import PtjNumberFilter from "./number-filter.vue"
 import PtjFlagFilter from "./flag-filter.vue"
 import PtjIdFilter from "./id-filter.vue"
 import PtjTimeFilter from "./time-filter.vue"
 import PtjStringFilter from "./string-filter.vue"

 const props = defineProps({
    bind : Object,
});


</script>