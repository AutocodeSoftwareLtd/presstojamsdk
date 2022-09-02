 <template>
    <ptj-number v-if="field.type=='number'" v-model="value" :field="field" />
    <ptj-flag v-else-if="field.type=='flag'" v-model="value" :field="field" />
    <ptj-id v-else-if="field.type=='id'" v-model="value" :field="field" />
    <ptj-asset v-else-if="field.type=='asset'" v-model="value" :field="field" />
    <ptj-time v-else-if="field.type=='time'" v-model="value" :field="field" />
    <ptj-string v-else v-model="value" :field="field" />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number-edit.vue"
 import PtjFlag from "./fields/ptj-flag-edit.vue"
 import PtjId from "./fields/ptj-id-edit.vue"
 import PtjTime from "./fields/ptj-time-edit.vue"
 import PtjString from "./fields/ptj-string-edit.vue"
 import PtjAsset from "./fields/ptj-asset-edit.vue"
 import { computed } from "vue"


const props = defineProps({
    field : Object,
    modelValue : [String, Number, Boolean, null]
});

const emits = defineEmits([
    "update:modelValue"
]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

</script>