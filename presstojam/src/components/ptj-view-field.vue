 <template>
    <ptj-number v-if="field.type=='number'" v-model="modelValue" :field="field" />
    <ptj-flag v-else-if="field.type=='flag'"  v-model="modelValue" :field="field"/>
    <ptj-id v-else-if="field.type=='id'" v-model="modelValue" :field="field" :id="id" :model="model" />
    <ptj-time v-else-if="field.type=='time'" v-model="modelValue" :field="field" />
    <ptj-string v-else-if="field.type=='string'" v-model="modelValue" :field="field" />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number.vue"
 import PtjFlag from "./fields/ptj-flag.vue"
 import PtjId from "./fields/ptj-id.vue"
 import PtjTime from "./fields/ptj-time.vue"
 import PtjString from "./fields/ptj-string.vue"

const props = defineProps({
    field : Object,
    modelValue : [String,Number,Boolean],
    id : [Number, null, String],
    model : String
});


</script>