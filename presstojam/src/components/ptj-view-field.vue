 <template>
    <ptj-number v-if="field.type=='number'" v-model="modelValue" />
    <ptj-flag v-else-if="field.type=='flag'"  v-model="modelValue"/>
    <ptj-id v-else-if="field.type=='id'" v-model="modelValue" />
    <ptj-time v-else-if="field.type=='time'" v-model="modelValue" />
    <ptj-string v-else-if="field.type=='string'" v-model="modelValue" />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number.vue"
 import PtjFlag from "./fields/ptj-flag.vue"
 import PtjId from "./fields/ptj-id.vue"
 import PtjTime from "./fields/ptj-time.vue"
 import PtjString from "./fields/ptj-string.vue"
 import { provide } from "vue"

const props = defineProps({
    field : Object,
    modelValue : [String,Number]
});

provide("cell", props.field);

</script>