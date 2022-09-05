 <template>
    <ptj-number-filter v-if="field.type=='number'" v-model="value" :field="field" />
    <ptj-flag-filter v-else-if="field.type=='flag'" v-model="value" :field="field" />
    <ptj-id-filter v-else-if="field.type=='id'" v-model="value" :field="field" />
    <ptj-time-filter v-else-if="field.type=='time'" v-model="value" :field="field" />
    <ptj-string-filter v-else-if="field.type=='string'" v-model="value" :field="field" />
</template>
<script setup>
 import PtjNumberFilter from "./fields/ptj-number-filter.vue"
 import PtjFlagFilter from "./fields/ptj-flag-filter.vue"
 import PtjIdFilter from "./fields/ptj-id-filter.vue"
 import PtjTimeFilter from "./fields/ptj-time-filter.vue"
 import PtjStringFilter from "./fields/ptj-string-filter.vue"
 import { computed} from "vue"


 const props = defineProps({
    field : Object,
    modelValue : [String, Number, Boolean, null, Array, Object]
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