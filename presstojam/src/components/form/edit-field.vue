 <template>
    <div class="form-check field-checkbox" v-if="bind.cell.type=='flag'">
        <Flag :bind="bind" />
        <label :for="bind.cell.name" class="form-check-label">{{ $t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label") }}</label>
        <Error v-if="bind.show_error" :bind="bind" />

    </div>
    <div class="json-group" v-else-if="bind.cell.type=='json'">
        <PtjJson :bind="bind" :active_validation="active_validation" />
    </div>
    <div class="form-group field row" v-else>
        <label :for="bind.cell.name" class="form-label">{{ $t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label") }} </label>
        <Number v-if="bind.cell.type=='number'" :bind="bind" class="col"/>
        <Id v-else-if="bind.cell.type=='id'" :bind="bind" class="col"/>
        <Asset v-else-if="bind.cell.type=='asset'" :bind="bind" class="col"/>
        <Time v-else-if="bind.cell.type=='time'" :bind="bind" class="col"/>
        <PtjJson v-else-if="bind.cell.type=='json'" :bind="bind" :active_validation="active_validation" class="col"/>
        <PtjString v-else :bind="bind" class="col"/>
        <Error v-if="bind.show_error" :bind="bind" class="col"/>
    </div>
</template>
<script setup>
 import Number from "./number-edit.vue"
 import Flag from "./flag-edit.vue"
 import Id from "./id-edit.vue"
 import Time from "./time-edit.vue"
 import PtjString from "./string-edit.vue"
 import Asset from "./asset-edit.vue"
 import PtjJson from "./json-edit.vue"
 import Error from "./error.vue"
 import { computed } from "vue"


const props = defineProps({
    bind : Object,
    active_validation : Boolean
});

const emits = defineEmits([
    "update:modelValue"
]);

const error = computed(() => {
    if (props.bind.show_error) return props.error;
    else return 0;
});


</script>