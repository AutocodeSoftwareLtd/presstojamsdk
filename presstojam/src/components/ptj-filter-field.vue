 <template>
    <ptj-number-filter v-if="field.type=='number'" />
    <ptj-flag-filter v-else-if="field.type=='flag'" />
    <ptj-id-filter v-else-if="field.type=='id'" />
    <ptj-time-filter v-else-if="field.type=='time'" />
    <ptj-string-filter v-else-if="field.type=='string'" />
</template>
<script setup>
 import PtjNumberFilter from "./fields/ptj-number-filter.vue"
 import PtjFlagFilter from "./fields/ptj-flag-filter.vue"
 import PtjIdFilter from "./fields/ptj-id-filter.vue"
 import PtjTimeFilter from "./fields/ptj-time-filter.vue"
 import PtjStringFilter from "./fields/ptj-string-filter.vue"
 import { provide } from "vue"


 const props = defineProps({
    field : Object,
});

provide("cell", props.field);

</script>