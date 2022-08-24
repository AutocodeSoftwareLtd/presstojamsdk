 <template>
    <ptj-number v-if="field.type=='number'" />
    <ptj-flag v-else-if="field.type=='flag'" />
    <ptj-id v-else-if="field.type=='id'" />
    <ptj-asset v-else-if="field.type=='asset'" />
    <ptj-time v-else-if="field.type=='time'" />
    <ptj-string v-else />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number-edit.vue"
 import PtjFlag from "./fields/ptj-flag-edit.vue"
 import PtjId from "./fields/ptj-id-edit.vue"
 import PtjTime from "./fields/ptj-time-edit.vue"
 import PtjString from "./fields/ptj-string-edit.vue"
 import PtjAsset from "./fields/ptj-asset-edit.vue"
 import { provide } from "vue"

const props = defineProps({
    field : Object
});

provide("cell", props.field);

</script>