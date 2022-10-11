 <template>
    <ptj-number v-if="bind.cell.type=='number'" :bind="bind" />
    <ptj-flag v-else-if="bind.cell.type=='flag'" :bind="bind" />
    <ptj-id v-else-if="bind.cell.type=='id'" :bind="bind" />
    <ptj-asset v-else-if="bind.cell.type=='asset'" :bind="bind" />
    <ptj-time v-else-if="bind.cell.type=='time'" :bind="bind" />
    <ptj-json v-else-if="bind.cell.type=='json'" :bind="bind" :active_validation="active_validation" />
    <ptj-string v-else :bind="bind" />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number-edit.vue"
 import PtjFlag from "./fields/ptj-flag-edit.vue"
 import PtjId from "./fields/ptj-id-edit.vue"
 import PtjTime from "./fields/ptj-time-edit.vue"
 import PtjString from "./fields/ptj-string-edit.vue"
 import PtjAsset from "./fields/ptj-asset-edit.vue"
 import PtjJson from "./fields/ptj-json-edit.vue"


const props = defineProps({
    bind : Object,
    active_validation : Boolean
});

const emits = defineEmits([
    "update:modelValue"
]);

</script>