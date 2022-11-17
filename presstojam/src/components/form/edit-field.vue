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
 import PtjNumber from "./number-edit.vue"
 import PtjFlag from "./flag-edit.vue"
 import PtjId from "./id-edit.vue"
 import PtjTime from "./time-edit.vue"
 import PtjString from "./string-edit.vue"
 import PtjAsset from "./asset-edit.vue"
 import PtjJson from "./json-edit.vue"


const props = defineProps({
    bind : Object,
    active_validation : Boolean
});

const emits = defineEmits([
    "update:modelValue"
]);

</script>